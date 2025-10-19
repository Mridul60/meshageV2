# MeshageV2 AI Assistant Instructions

## Project Overview
MeshageV2 is a React Native messaging application built with TypeScript. The app follows a component-based architecture with a focus on maintainable UI components and screen layouts.

## Key Architecture Points

### Component Structure
- **Components (`src/components/`)**: Reusable UI components
  - Example: `BottomNavigation.tsx` shows the app's navigation pattern using `Ionicons`
  - Components use TypeScript interfaces for prop definitions
- **Screens (`src/screens/`)**: Full app screens composed of components
  - Example: `ChatScreen.tsx` demonstrates screen composition with `Header`, `ChatItem`, and `AddFriendBanner`

### Development Workflows

#### Setup
1. Install dependencies:
```bash
npm install
```
2. For iOS, additional setup is required:
```bash
bundle install
bundle exec pod install
```

#### Running the App
1. Start Metro bundler:
```bash
npm start
```
2. Run on platform:
```bash
npm run android
# or
npm run ios
```

### Project Conventions

#### Styling
- Each component has its own `StyleSheet.create()` definition
- Dark theme colors are used consistently:
  - Background: `#1a1a1a`
  - Active elements: `#ffa500`
  - Inactive elements: `#666`

#### Component Patterns
- Components are functional components with TypeScript (`React.FC`)
- Props interfaces are defined at the top of component files
- Components use `SafeAreaView` for iOS notch compatibility

#### State Management
- Currently using local state with mock data (see `chatData` in `ChatScreen.tsx`)
- Message data structure follows the `Chat` interface pattern

### Testing
- Jest setup with React Native testing utilities
- Run tests with: `npm test`

## Troubleshooting Tips
- For iOS build issues, ensure CocoaPods are properly installed and run `bundle exec pod install`
- For Android build issues, check the Android SDK setup in `android/build.gradle`

## Key Files for New Features
- Add new screens in `src/screens/`
- Add new reusable components in `src/components/`
- Update navigation items in `BottomNavigation.tsx`