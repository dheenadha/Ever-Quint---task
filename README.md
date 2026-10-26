# Team Workflow Board

A modern, production-ready React application for managing team workflows and tasks. Built with React 18, Vite, and Tailwind CSS, this application provides a comprehensive task management solution similar to Jira or Trello.

## Features

### 🎯 Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks
- **Kanban Board**: Visual workflow management with drag-and-drop support
- **Task Filtering**: Filter tasks by status, priority, assignee, and tags
- **Task Sorting**: Sort by creation date, update date, priority, or title
- **URL Sync**: Filters and sorting persist in URL parameters

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Real-time Updates**: Instant feedback with toast notifications
- **Empty States**: Helpful messages when no tasks match filters
- **Loading States**: Smooth loading indicators

### 💾 Data Management
- **Local Storage**: All data stored locally in browser
- **Schema Migration**: Automatic data migration for app updates
- **Backup System**: Automatic backup before migrations
- **Data Validation**: Comprehensive client-side validation

### 🔧 Technical Features
- **Reusable Components**: Modular design system with 10+ UI components
- **Custom Hooks**: 5 specialized hooks for state management
- **Performance Optimized**: Memoization and efficient re-rendering
- **Type Safe**: Comprehensive validation and error handling
- **Test Coverage**: Unit tests with Jest and React Testing Library

## Tech Stack

- **Frontend**: React 18, Vite, JavaScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API with custom hooks
- **Testing**: Jest, React Testing Library
- **Persistence**: localStorage with custom migration system

## Project Structure

```
src/
├── app/                    # Main application components
│   ├── App.jsx            # Main app component
│   └── routes.jsx         # Route configuration
├── components/            # Reusable UI components
│   └── ui/               # Design system components
│       ├── Button.jsx
│       ├── TextInput.jsx
│       ├── TextArea.jsx
│       ├── Select.jsx
│       ├── Badge.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       └── Toast.jsx
├── features/             # Feature-specific components
│   ├── board/           # Kanban board functionality
│   ├── tasks/           # Task management
│   └── filters/         # Filtering and sorting
├── hooks/               # Custom React hooks
├── services/            # Business logic and data services
├── utils/               # Utility functions
├── context/             # React context providers
├── tests/               # Unit tests
└── styles/              # Global styles
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-workflow-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:3000`

## Usage

### Creating Tasks

#### Method 1: Quick Button (Easiest!)
1. Click the blue **+** button in the bottom-right corner
2. Use pre-defined quick actions or enter a custom title
3. Set status and priority
4. Click "Create Task"

**Keyboard Shortcut:** Press `Ctrl+N` (or `Cmd+N` on Mac) for instant access!

#### Method 2: Full Task Form
1. Click the "Create Task" button (or use the task form)
2. Fill in the task details:
   - Title (required, 2-100 characters)
   - Description (optional, up to 500 characters)
   - Status (Backlog, In Progress, Done)
   - Priority (Low, Medium, High)
   - Assignee (optional, up to 50 characters)
   - Tags (optional, up to 10 tags, 20 characters each)
3. Click "Create Task" to save

#### Method 3: Quick Actions
The Quick Creator includes pre-defined actions for common tasks:
- 📋 Review PRs
- 📚 Write documentation  
- 👀 Code review

Just click any quick action to create the task instantly!

### Managing Tasks
- **Edit**: Click on any task card to view details and edit
- **Move**: Use the dropdown in task cards or **drag and drop** between columns
- **Delete**: Use the delete button in task details
- **Filter**: Use the filters bar to narrow down tasks
- **Sort**: Choose from multiple sorting options

### 🖱️ **Drag and Drop Features**
- **Intuitive Movement**: Drag tasks between Backlog, In Progress, and Done columns
- **Visual Feedback**: Smooth animations and hover effects during drag operations
- **Drop Targets**: Clear visual indicators showing where tasks can be dropped
- **Status Updates**: Automatic status updates when tasks are moved
- **Accessibility**: Full keyboard support for drag and drop operations

### Filtering and Sorting
- **Status Filter**: Show only specific task statuses
- **Priority Filter**: Filter by task priority
- **Search**: Search by title, description, assignee, or tags
- **Sort Options**: Sort by date, priority, or title

### Keyboard Shortcuts
- **ESC**: Close modals and dropdowns
- **Tab**: Navigate between interactive elements
- **Enter**: Confirm actions in forms and modals

## Data Persistence

All data is stored locally in your browser's localStorage. This means:

- ✅ Data persists between browser sessions
- ✅ No server required
- ✅ Works offline
- ✅ Private - data never leaves your device

### Schema Migration

The application includes an automatic migration system that:

- Detects when data schema needs updating
- Creates backups before migration
- Updates data to the latest format
- Shows notifications when migration completes

## Accessibility

This application follows WCAG 2.1 guidelines:

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: High contrast ratios for readability
- **Responsive**: Works on all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
npm test:watch       # Run tests in watch mode
```

### Code Style

This project uses ESLint with React-specific rules. Run `npm run lint` to check for issues.

### Testing

Tests are located in the `src/tests/` directory. Run tests with:

```bash
npm test
```

### Performance

The application includes several performance optimizations:

- **Memoization**: Expensive calculations are memoized
- **Lazy Loading**: Components load only when needed
- **Efficient Re-renders**: Minimal state updates
- **Virtualization Ready**: Prepared for large task lists

## Architecture

### Component Hierarchy

```
App
├── TaskProvider (Context)
│   ├── FiltersBar
│   └── Board
│       ├── Column (Backlog)
│       ├── Column (In Progress)
│       └── Column (Done)
│           └── TaskCard
└── TaskModal
    └── TaskForm
```

### Data Flow

1. **Context Provider**: Manages global state
2. **Custom Hooks**: Handle specific functionality
3. **Services**: Business logic and data operations
4. **Components**: Presentational and interactive elements

### State Management

- **Global State**: Tasks, filters, UI state via Context
- **Local State**: Form data, component-specific state
- **Persistent State**: Tasks and settings in localStorage

## Customization

### Adding New Task Fields

1. Update the task model in `utils/constants.js`
2. Add validation rules
3. Update the TaskForm component
4. Update storage migration if needed

### Adding New Filters

1. Add filter options to `utils/constants.js`
2. Update the `useFilters` hook
3. Modify the FiltersBar component
4. Update the Board component

### Styling Changes

The application uses Tailwind CSS. Customize styles by:

1. Modifying `src/styles/global.css`
2. Updating component-specific styles
3. Adding new utility classes

## Troubleshooting

### Common Issues

**Tasks not saving:**
- Check browser localStorage is enabled
- Clear browser storage and restart
- Check browser console for errors

**Filters not working:**
- Ensure URL parameters are correct
- Check filter state in React DevTools
- Verify task data structure

**Performance issues:**
- Check for excessive re-renders
- Verify memoization is working
- Consider virtualization for large lists

### Debug Mode

Enable debug logging by adding this to any component:

```javascript
console.log('Debug:', { state, props, data });
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- **Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check this README and code comments

## Future Improvements

Planned features and improvements:

- [ ] Drag and drop task reordering
- [ ] Task dependencies and relationships
- [ ] Team collaboration features
- [ ] Export/import functionality
- [ ] Dark mode toggle
- [ ] Advanced search with operators
- [ ] Task templates
- [ ] Analytics and reporting
- [ ] Integration with external services

## AI Assistance Disclosure

This project was developed with the assistance of AI tools for code generation, documentation, and testing. All code has been reviewed and tested by human developers to ensure quality and functionality.