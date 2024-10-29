import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "react-query"
import api from "./lib/api"
import { Alert, AlertDescription } from "./components/ui/alert";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

const getOrders = async ({ 
  page = 1, 
  accessionNumber = '', 
  status = '', 
  orderId = '' 
}) => {
  const params = new URLSearchParams({
    page: String(page),
    ...(accessionNumber && { accessionNumber }),
    ...(status && { status }),
    ...(orderId && { orderId })
  });

  const { data } = await api.get(`/items?${params}`);
  return data;
};

export function App() {
  const [filters, setFilters] = useState({
    accessionNumber: '',
    status: '',
    orderId: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data, 
    isLoading, 
    isError, 
    error,
  } = useQuery({
    queryKey: ['items', currentPage, filters],
    queryFn: () => getOrders({ 
      page: currentPage,
      ...filters 
    }),
    keepPreviousData: true
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value == 'all' ? undefined : value
    }));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4">Pesquisa de pedidos</h1>
        <h2 className="text-muted-foreground text-sm">
          Bem vindo(a) a tela de relatório da integração entre o MV e o PACS.
        </h2>
      </div>
      
          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-3xl">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium">Accession Number</Label>
                <Input
                  type="number"
                  value={filters.accessionNumber}
                  onChange={(e) => handleFilterChange('accessionNumber', e.target.value)}
                  placeholder="0000"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Número do pedido</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={filters.orderId}
                    onChange={(e) => handleFilterChange('orderId', e.target.value)}
                    placeholder="0000"
                    className="pl-8"
                  />
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                </div>
              </div> */}
            </div>
          </div>
      <Table>
        <TableCaption>Lista de pedidos e seus detalhes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Acession Number</TableHead>
            <TableHead className="w-[20%]">Exame</TableHead>
            <TableHead className="w-[20%]">Nome do paciente</TableHead>
            <TableHead className="w-[20%]">Médico solicitante</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[20%]">Detalhes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.data.map((order: any, index: any) => (
            <TableRow key={index}>
              <TableCell>{order.acessionNumber}</TableCell>
              <TableCell>{order.exam}</TableCell>
              <TableCell>{order.patientName}</TableCell>
              <TableCell>{order.doctor}</TableCell>
              <TableCell>
                <Badge variant={order.status === "success" ? "default" : order.status === "error" ? "destructive" : "outline"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Ver Detalhes</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Detalhes do Pedido</DialogTitle>
                      <DialogDescription>
                        Informações detalhadas do pedido {order.acessionNumber}
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Accession Number</TableCell>
                          <TableCell>{order.acessionNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nome do Médico</TableCell>
                          <TableCell>{order.doctor}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nome do Paciente</TableCell>
                          <TableCell>{order.patientName}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Exame</TableCell>
                          <TableCell>{order.exam}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Data de criação</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleString('pt-BR')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    {order.failReason && (
                      <div className="flex items-start gap-3">
                        <X className="text-red-500 w-12 h-12" />
                        <div>
                          <Label className="font-medium text-muted-foreground">Detalhes do Erro</Label>
                          <p className="my-1">{order.failReason}</p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error?.response?.data?.message || 'An error occurred while fetching data'}
          </AlertDescription>
        </Alert>
      )}
      {!isLoading && !isError && data?.meta && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * 10) + 1} até {Math.min(currentPage * 10, data.meta.lastPage)} de {data.meta.lastPage} resultados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-md disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm">
                Página {currentPage} de {data.meta.lastPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.meta.lastPage))}
                disabled={currentPage === data.meta.lastPage}
                className="p-2 border rounded-md disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  )
}