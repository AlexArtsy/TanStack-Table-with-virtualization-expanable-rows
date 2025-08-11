import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
  ExpandedState,
  Row,
  getExpandedRowModel,
} from '@tanstack/react-table';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Collapse,
  TableSortLabel,
} from '@mui/material';
import {
  Search,
  People,
  Speed,
} from '@mui/icons-material';
import { User } from '../types/User';
import { mockUsers } from '../data/mockUsers';
import MuiUserDetailCard from './MuiUserDetailCard';

const columnHelper = createColumnHelper<User>();

const MuiVirtualizedAccordionTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [users, setUsers] = useState(mockUsers);

  const parentRef = useRef<HTMLDivElement>(null);

  const handleUpdateUser = (userId: string, field: keyof User, value: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, [field]: field === 'projects' ? parseInt(value) : value }
          : user
      )
    );
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      case 'pending':
        return 'Ожидает';
      default:
        return 'Неизвестно';
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Сотрудник',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {info.getValue().split(' ').map(n => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {info.getValue()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {info.row.original.email}
            </Typography>
          </Box>
        </Box>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Должность',
      cell: (info) => (
        <Box>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {info.getValue()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {info.row.original.department}
          </Typography>
        </Box>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Статус',
      cell: (info) => (
        <Chip
          label={getStatusLabel(info.getValue())}
          color={getStatusColor(info.getValue())}
          size="small"
          variant="outlined"
        />
      ),
    }),
    columnHelper.accessor('projects', {
      header: 'Проекты',
      cell: (info) => (
        <Typography variant="body2" fontWeight={500} color="text.primary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleRowExpansion(row);
          }}
          sx={{ color: 'text.secondary' }}
        >
          {/* {expanded.has(row.original.id) ? <ExpandLess /> : <ExpandMore />} */}
        </IconButton>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      expanded
    },
    debugTable: true
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = rows[index];
      return row.getIsExpanded() ? 850 : 73; // Regular row height vs detail card height
    },
    measureElement: el => el?.getBoundingClientRect().height ?? 0, //  колбек для перезамера элемента
    overscan: 5
  });

  const toggleRowExpansion = (row: Row<User>) => {
    row.toggleExpanded();
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <People />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                Сотрудники
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Управление командой с Material-UI и виртуализацией
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<Speed />}
              label="Виртуализация"
              color="success"
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Всего: {table.getFilteredRowModel().rows.length} сотрудников
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по имени, email, должности..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Paper>

      {/* Virtualized Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        bgcolor: 'grey.50',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        '&:hover': {
                          bgcolor: header.column.getCanSort() ? 'grey.100' : 'grey.50',
                        },
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <TableSortLabel
                            active={true}
                            direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
                          />
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
          </Table>
        </TableContainer>

        <Box
          ref={parentRef}
          sx={{
            height: 600,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.100',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 1,
            },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isExpanded = expanded[row.id];
              return (
                isExpanded
                ? (
                  <Box
                    key={`detail-${row.id}`}
                    data-index={virtualRow.index}
                    ref={node => rowVirtualizer.measureElement(node)}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Collapse in={true} timeout={200}>
                      <MuiUserDetailCard
                        user={row.original} 
                        onUpdateUser={handleUpdateUser}
                        onClose={() => toggleRowExpansion(row)}
                      />
                    </Collapse>
                  </Box>
                )
                : (
                  <Box
                  key={`row-${row.id}`}
                  data-index={virtualRow.index}
                  ref={node => rowVirtualizer.measureElement(node)}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Table>
                    <TableBody>
                      <TableRow
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        onClick={() => toggleRowExpansion(row)}
                      >
                        {row.getVisibleCells().map((cell: any) => (
                          <TableCell key={cell.id} sx={{ py: 2 }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
                )
              );
            })}
          </Box>
        </Box>

        {table.getRowModel().rows.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <People sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              Сотрудники не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Попробуйте изменить поисковый запрос
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Performance Info */}
      <Paper sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Speed color="success" />
          <Box>
            <Typography variant="body2" fontWeight={600} color="success.dark">
              Виртуализация активна
            </Typography>
            <Typography variant="caption" color="success.dark">
              Отображается {rowVirtualizer.getVirtualItems().length} из {rows.length} элементов для оптимальной производительности
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MuiVirtualizedAccordionTable;