"use client"

import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { IconCheck, IconX, IconPhoto } from "@tabler/icons-react"
import { toast } from "sonner"
import Image from "next/image"

export default function TransactionPage() {
    const { currentUser, transactions, members, updateTransactionStatus } = useAppStore()

    if (!currentUser) return null
    const myTransactions = transactions.filter(t => t.adminId === currentUser.id)

    const handleStatusUpdate = (id: string, status: 'APPROVED' | 'REJECTED') => {
        updateTransactionStatus(id, status)
        toast.success(`Transaction ${status.toLowerCase()}`)
    }

    const getMemberName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown'

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Payment verifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Slip</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{getMemberName(tx.memberId)}</TableCell>
                                    <TableCell>฿{tx.amount.toLocaleString()}</TableCell>
                                    <TableCell>{tx.type}</TableCell>
                                    <TableCell>
                                        {tx.slipUrl && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"><IconPhoto className="h-4 w-4 mr-2" /> View</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <div className="relative aspect-[3/4] w-full mt-4">
                                                        {/* In a real app we'd use Next Image, but mock data URLs might be external or broken, just generic placeholder if needed */}
                                                        <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
                                                            Mock Slip Image
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tx.status === 'APPROVED' ? 'default' : tx.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {tx.status === 'PENDING' && (
                                            <>
                                                <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(tx.id, 'APPROVED')} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <IconCheck className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleStatusUpdate(tx.id, 'REJECTED')} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                    <IconX className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
