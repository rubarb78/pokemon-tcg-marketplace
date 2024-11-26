import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

interface Order {
  id: string
  date: Date
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  items: {
    card: {
      id: string
      name: string
      price: number
    }
    quantity: number
  }[]
}

const OrderRow = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
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
                      <TableCell>{item.card.price.toFixed(2)}€</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {(item.card.price * item.quantity).toFixed(2)}€
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      try {
        const ordersRef = collection(db, 'orders')
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[]
        setOrders(ordersData)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ py: 8 }}>
          Veuillez vous connecter pour voir vos commandes
        </Typography>
      </Container>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mes Commandes
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ py: 4 }}>
            Vous n'avez pas encore de commandes
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Numéro de commande</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  )
}

export default Orders
