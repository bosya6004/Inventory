'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, IconButton } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'Inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    if (sortBy === 'name') {
      inventoryList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'time') {
      inventoryList.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
    }
    setInventory(inventoryList)
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'Inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1, timestamp: serverTimestamp() }, { merge: true })
    } else {
      await setDoc(docRef, { quantity: 1, timestamp: serverTimestamp() })
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [sortBy]);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection='column' justifyContent="center" alignItems="center" gap={2} padding={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }} width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
            <Button variant="outlined" onClick={() => { addItem(itemName); setItemName(''); handleClose() }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton color="primary" onClick={() => setSortBy('name')}>
          <SortByAlphaIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => setSortBy('time')}>
          <AccessTimeIcon />
        </IconButton>
        <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
          Add New Item
        </Button>
      </Stack>
      <Box width="100%" flex="1" display="flex" flexDirection="column" alignItems="center" overflow="auto">
        <Box width='800px' bgcolor='#ADD8E6' alignItems='center' justifyContent='center' display='flex' p={2}>
          <Typography variant="h2" color='#333'>Inventory Items</Typography>
        </Box>
        <Stack width='800px' spacing={2} overflow='auto' p={2}>
          {inventory.map(({ name, quantity, timestamp }) => (
            <Box key={name} width='100%' minHeight='150px' display='flex' alignItems='center' justifyContent='space-between' bgcolor='#f0f0f0' padding={3} borderRadius={1}>
              <Typography variant="h4" color='#333'>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h4" color='#333'>{quantity}</Typography>
              <Typography variant="body2" color='#666'>{timestamp ? new Date(timestamp.seconds * 1000).toLocaleString() : 'No timestamp'}</Typography>
              <Stack direction='row' spacing={2}>
                <IconButton color="primary" onClick={() => addItem(name)}>
                  <AddIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <RemoveIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
