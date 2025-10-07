import Breadcrumbs from 'src/Components/breadcrumbs'
import { useIntl } from 'react-intl'

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress
} from '@mui/material'

function Setting() {
  const { messages } = useIntl()
  

  return (
    <div>
      <Breadcrumbs routers={[{ name: messages.dialogs.settings }]} isDashboard />
      <UsersTable />
    </div>
  )
}

export default Setting

function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Pagination states
  const [page, setPage] = useState(0) // current page
  const [rowsPerPage, setRowsPerPage] = useState(5) // rows per page

  // Fake API (jsonplaceholder users)
  useEffect(() => {
  
  }, [])

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {loading ? (
        <div className='flex justify-center items-center p-4'>
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component='div'
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </>
      )}
    </Paper>
  )
}
