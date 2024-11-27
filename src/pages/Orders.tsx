import React, { useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  TablePagination
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { useOrder } from '../hooks/useOrder'
import { Order } from '../services/OrderService'

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
        <TableCell>{order.total.toFixed(2)}€</TableCell>
        <TableCell>
          <Chip
            label={order.status}
            color={
              order.status === 'completed'
                ? 'success'
                : order.status === 'cancelled'
                ? 'error'
                : 'warning'
            }
          />
        </TableCell>
        <TableCell>{order.paymentMethod}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Détails de la commande
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Carte</TableCell>
                    <TableCell>Prix unitaire</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.card.id}>
                      <TableCell>{item.card.name}</TableCell>
                      <TableCell>{item.card.cardmarket.prices.averageSellPrice.toFixed(2)}€</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {(item.card.cardmarket.prices.averageSellPrice * item.quantity).toFixed(2)}€
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {order.shippingAddress && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Adresse de livraison
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.zipCode} {order.shippingAddress.city}
                    <br />
                    {order.shippingAddress.state}, {order.shippingAddress.country}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Orders: React.FC = () => {
  const { user } = useAuth()
  const { orders, loading, error, hasMore, fetchOrders } = useOrder()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  useEffect(() => {
    if (user) {
      fetchOrders(true)
    }
  }, [user, fetchOrders])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    if (newPage * rowsPerPage >= orders.length && hasMore) {
      fetchOrders()
    }
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Veuillez vous connecter pour voir vos commandes
        </Alert>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Mes commandes
      </Typography>
      
      {loading && orders.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Alert severity="info">Vous n'avez pas encore de commandes</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Numéro</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Paiement</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={-1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelDisplayedRows={({ from, to }) => `${from}-${to}`}
          />
          
          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Orders
