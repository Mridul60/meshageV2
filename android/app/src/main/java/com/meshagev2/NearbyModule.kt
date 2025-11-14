package com.meshagev2

import android.util.Log
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.nearby.Nearby
import com.google.android.gms.nearby.connection.ConnectionInfo
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback
import com.google.android.gms.nearby.connection.ConnectionsClient
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback
import com.google.android.gms.nearby.connection.Payload
import com.google.android.gms.nearby.connection.PayloadCallback
import com.google.android.gms.nearby.connection.PayloadTransferUpdate
import com.google.android.gms.nearby.connection.Strategy

class NearbyModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val connectionsClient: ConnectionsClient = Nearby.getConnectionsClient(reactContext)
    private var endpointName: String = "User"
    private val connectedEndpoints = mutableSetOf<String>()

    override fun getName(): String = "NearbyModule"

    private val strategy = Strategy.P2P_CLUSTER

    private fun sendEvent(eventName: String, params: com.facebook.react.bridge.WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun sendPeersEvent() {
        val endpointsArray = Arguments.createArray()
        for (id in connectedEndpoints) {
            val map = Arguments.createMap()
            map.putString("id", id)
            map.putString("name", endpointName)
            endpointsArray.pushMap(map)
        }
        val result = Arguments.createMap()
        result.putArray("peers", endpointsArray)
        sendEvent("Nearby_onPeersChanged", result)
    }

    private val endpointDiscoveryCallback = object : EndpointDiscoveryCallback() {
        override fun onEndpointFound(endpointId: String, info: DiscoveredEndpointInfo) {
            Log.d("NearbyModule", "Endpoint found: $endpointId ${info.endpointName}")
            val map = Arguments.createMap()
            map.putString("id", endpointId)
            map.putString("name", info.endpointName)
            sendEvent("Nearby_onEndpointFound", map)
        }

        override fun onEndpointLost(endpointId: String) {
            Log.d("NearbyModule", "Endpoint lost: $endpointId")
            val map = Arguments.createMap()
            map.putString("id", endpointId)
            sendEvent("Nearby_onEndpointLost", map)
        }
    }

    private val connectionLifecycleCallback = object : ConnectionLifecycleCallback() {
        override fun onConnectionInitiated(endpointId: String, connectionInfo: ConnectionInfo) {
            Log.d("NearbyModule", "Connection initiated: $endpointId")
            connectionsClient.acceptConnection(endpointId, payloadCallback)
        }

        override fun onConnectionResult(endpointId: String, result: com.google.android.gms.nearby.connection.ConnectionResolution) {
            Log.d("NearbyModule", "Connection result: $endpointId ${result.status.statusCode}")
            if (result.status.isSuccess) {
                connectedEndpoints.add(endpointId)
                val map = Arguments.createMap()
                map.putString("id", endpointId)
                map.putBoolean("connected", true)
                sendEvent("Nearby_onConnectionChanged", map)
                sendPeersEvent()
            }
        }

        override fun onDisconnected(endpointId: String) {
            Log.d("NearbyModule", "Disconnected: $endpointId")
            connectedEndpoints.remove(endpointId)
            val map = Arguments.createMap()
            map.putString("id", endpointId)
            map.putBoolean("connected", false)
            sendEvent("Nearby_onConnectionChanged", map)
            sendPeersEvent()
        }
    }

    private val payloadCallback = object : PayloadCallback() {
        override fun onPayloadReceived(endpointId: String, payload: Payload) {
            if (payload.type == Payload.Type.BYTES) {
                val bytes = payload.asBytes()
                val message = bytes?.toString(Charsets.UTF_8) ?: return
                val map = Arguments.createMap()
                map.putString("fromId", endpointId)
                map.putString("message", message)
                map.putDouble("timestamp", System.currentTimeMillis().toDouble())
                sendEvent("Nearby_onMessageReceived", map)
            }
        }

        override fun onPayloadTransferUpdate(endpointId: String, update: PayloadTransferUpdate) {
            // No-op for now
        }
    }

    @ReactMethod
    fun start(endpointNameArg: String, promise: Promise) {
        endpointName = endpointNameArg
        try {
            val hasAccessWifi = ContextCompat.checkSelfPermission(
                reactContext,
                android.Manifest.permission.ACCESS_WIFI_STATE
            ) == PackageManager.PERMISSION_GRANTED
            val hasChangeWifi = ContextCompat.checkSelfPermission(
                reactContext,
                android.Manifest.permission.CHANGE_WIFI_STATE
            ) == PackageManager.PERMISSION_GRANTED

            Log.d(
                "NearbyModule",
                "WiFi perms - ACCESS_WIFI_STATE=$hasAccessWifi, CHANGE_WIFI_STATE=$hasChangeWifi"
            )

            if (!hasAccessWifi || !hasChangeWifi) {
                val msg = "Missing WiFi permissions: ACCESS_WIFI_STATE=$hasAccessWifi, CHANGE_WIFI_STATE=$hasChangeWifi"
                Log.e("NearbyModule", msg)
                promise.reject("MISSING_WIFI_PERMISSIONS", msg)
                return
            }

            connectionsClient.startAdvertising(
                endpointName,
                reactContext.packageName,
                connectionLifecycleCallback,
                com.google.android.gms.nearby.connection.AdvertisingOptions.Builder()
                    .setStrategy(strategy)
                    .build()
            )
                .addOnSuccessListener {
                    Log.d("NearbyModule", "Advertising started")
                    connectionsClient.startDiscovery(
                        reactContext.packageName,
                        endpointDiscoveryCallback,
                        com.google.android.gms.nearby.connection.DiscoveryOptions.Builder()
                            .setStrategy(strategy)
                            .build()
                    ).addOnSuccessListener {
                        Log.d("NearbyModule", "Discovery started")
                        promise.resolve(true)
                    }.addOnFailureListener { e ->
                        Log.e("NearbyModule", "Discovery failed", e)
                        promise.reject("DISCOVERY_FAILED", e)
                    }
                }
                .addOnFailureListener { e ->
                    Log.e("NearbyModule", "Advertising failed", e)
                    promise.reject("ADVERTISING_FAILED", e)
                }
        } catch (e: Exception) {
            Log.e("NearbyModule", "Start error", e)
            promise.reject("START_ERROR", e)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        try {
            connectionsClient.stopAdvertising()
            connectionsClient.stopDiscovery()
            connectionsClient.stopAllEndpoints()
            connectedEndpoints.clear()
            sendPeersEvent()
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("NearbyModule", "Stop error", e)
            promise.reject("STOP_ERROR", e)
        }
    }

    @ReactMethod
    fun connect(endpointId: String, promise: Promise) {
        try {
            connectionsClient.requestConnection(
                endpointName,
                endpointId,
                connectionLifecycleCallback
            ).addOnSuccessListener {
                Log.d("NearbyModule", "Connection requested to $endpointId")
                promise.resolve(true)
            }.addOnFailureListener { e ->
                Log.e("NearbyModule", "connect failed", e)
                promise.reject("CONNECT_ERROR", e)
            }
        } catch (e: Exception) {
            Log.e("NearbyModule", "connect error", e)
            promise.reject("CONNECT_ERROR", e)
        }
    }

    @ReactMethod
    fun sendMessage(message: String, targetId: String?, promise: Promise) {
        try {
            val payload = Payload.fromBytes(message.toByteArray(Charsets.UTF_8))
            val targets = if (targetId != null && targetId.isNotEmpty()) {
                listOf(targetId)
            } else {
                connectedEndpoints.toList()
            }

            for (id in targets) {
                connectionsClient.sendPayload(id, payload)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("NearbyModule", "sendMessage error", e)
            promise.reject("SEND_ERROR", e)
        }
    }
}
