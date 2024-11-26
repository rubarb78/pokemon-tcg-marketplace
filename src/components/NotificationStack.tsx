import React from 'react'
import { Alert, Snackbar, Stack } from '@mui/material'
import { useNotification } from '../hooks/useNotification'

const NotificationStack = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <Stack spacing={2} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  )
}

export default NotificationStack
