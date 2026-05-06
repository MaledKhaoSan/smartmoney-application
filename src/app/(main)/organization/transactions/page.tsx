import { TransactionTable } from "./_components/transactionTable"

export default function TransactionPage() {
    return (
        <div className="space-y-6">
            <div className="px-2 md:px-0 py-5 flex flex-row items-center justify-between gap-2">
                <div className="flex flex-col items-start justify-between">
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">รายการการชำระเงิน</h2>
                    <p className="text-xs md:text-base text-muted-foreground line-clamp-1 md:line-clamp-none">
                        ตรวจสอบสถานะการชำระเงินล่าสุด
                    </p>
                </div>
            </div>
            <TransactionTable />
        </div>
    )
}
