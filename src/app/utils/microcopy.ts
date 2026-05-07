export const microcopy = {
  // Button labels
  buttons: {
    submit: 'Submit Response',
    cancel: 'Cancel',
    save: 'Save Changes',
    delete: 'Delete',
    edit: 'Edit',
    respond: 'Write Response',
    useSuggested: 'Use Suggested Response',
    export: 'Export Data',
    import: 'Import Data',
    login: 'Sign In to Your Account',
    register: 'Create New Account',
    logout: 'Log Out',
    contactSupport: 'Get Help',
    filter: 'Apply Filters',
    search: 'Search Reviews',
  },

  // Success messages
  success: {
    responseSubmitted: '✓ Response submitted successfully! Your customer will be notified.',
    dataImported: '✓ Data imported successfully!',
    dataExported: '✓ Your data has been exported and downloaded.',
    loginSuccess: '✓ Welcome back! Loading your dashboard...',
    registerSuccess: '✓ Account created successfully!',
  },

  // Error messages
  errors: {
    emptyResponse: '⚠ Please write a response before submitting.',
    importFailed: '⚠ Import failed. Please check your file format and try again.',
    exportFailed: '⚠ Export failed. Please try again.',
    loginFailed: '⚠ Invalid email or password. Please try again.',
    networkError: '⚠ Network error. Please check your connection and try again.',
    noFileSelected: '⚠ Please select a file to import.',
    invalidFileFormat: '⚠ Invalid file format. Please use CSV or JSON files only.',
  },

  // Confirmation messages
  confirmations: {
    deleteReview: 'Are you sure you want to delete this review? This action cannot be undone.',
    logout: 'Are you sure you want to log out?',
    discardChanges: 'You have unsaved changes. Are you sure you want to discard them?',
  },

  // Empty states
  emptyStates: {
    noReviews: 'No reviews found',
    noReviewsDescription: 'There are no reviews matching your current filters. Try adjusting your search criteria.',
    noData: 'No data available',
    noPendingReviews: 'Great job! All reviews have been responded to.',
    noSearchResults: 'No results found for your search.',
  },

  // Helper text
  helpers: {
    searchPlaceholder: 'Search by customer name, review text, or keywords...',
    emailPlaceholder: 'Enter your email address',
    passwordPlaceholder: 'Enter your password',
    responsePlaceholder: 'Write a thoughtful response to this review...',
    importHelp: 'Import reviews from CSV or JSON files. Maximum file size: 10MB',
    exportHelp: 'Export your reviews as CSV or JSON for backup or analysis',
    filterHelp: 'Use filters to find specific reviews quickly',
    urgencyHelp: 'High priority reviews require immediate attention',
    sentimentHelp: 'Automatically detected based on review content and rating',
  },

  // Loading states
  loading: {
    submitting: 'Submitting...',
    loading: 'Loading...',
    importing: 'Importing data...',
    exporting: 'Preparing export...',
    processing: 'Processing...',
  },

  // Feature descriptions
  features: {
    dashboard: 'Get a complete overview of your customer feedback with sentiment analysis and trends',
    insights: 'Deep dive into individual reviews with urgency prioritization and response tracking',
    responses: 'Engage with customers by responding to their reviews directly from the platform',
    analytics: 'Track performance metrics and identify trends over time',
  },
};
