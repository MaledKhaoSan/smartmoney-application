import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Member, User } from "@/types"

const formSchema = z.object({
    name: z.string().min(2, "กรุณาระบุชื่อ-นามสกุล"),
    phone: z.string().min(10, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก"),
    loanAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "ยอดกู้ต้องมากกว่า 0"),
    interestRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "ดอกเบี้ยต้องไม่ติดลบ"),
    interestType: z.enum(["DAILY", "MONTHLY"] as const),
    totalInstallments: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "จำนวนงวดต้องมากกว่า 0"),
    managementFee: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "ค่าธรรมเนียมต้องไม่ติดลบ"),
})

type FormValues = z.infer<typeof formSchema>

interface MemberFormProps {
    currentUser: User
    addMember: (member: Member) => void
    onSuccess: () => void
}

export function MemberForm({ currentUser, addMember, onSuccess }: MemberFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            loanAmount: '',
            interestRate: '0.5',
            interestType: 'DAILY',
            totalInstallments: '24',
            managementFee: '0',
        },
    })

    const watchedValues = form.watch()

    const calculations = useMemo(() => {
        const amount = Number(watchedValues.loanAmount) || 0
        const rate = Number(watchedValues.interestRate) || 0
        const installments = Number(watchedValues.totalInstallments) || 0
        const fee = Number(watchedValues.managementFee) || 0

        const dailyInterest = (amount * rate) / 100
        const totalInterest = dailyInterest * installments
        const totalPayable = amount + totalInterest
        const dailyInstallment = installments > 0 ? totalPayable / installments : 0
        const netReceived = amount - fee

        return {
            amount,
            installments,
            dailyInterest,
            totalInterest,
            totalPayable,
            dailyInstallment,
            netReceived,
            fee
        }
    }, [watchedValues])

    const onSubmit = (values: FormValues) => {
        const newMember: Member = {
            id: `mem_${Date.now()}`,
            adminId: currentUser.id,
            name: values.name,
            phone: values.phone,
            loanAmount: Number(values.loanAmount),
            interestRate: Number(values.interestRate),
            interestType: values.interestType,
            totalInstallments: Number(values.totalInstallments),
            paidInstallments: 0,
            status: 'ACTIVE',
            loanDate: new Date().toISOString(),
            managementFee: Number(values.managementFee)
        }
        addMember(newMember)
        toast.success("เพิ่มข้อมูลลูกหนี้เรียบร้อยแล้ว")
        onSuccess()
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ระบุชื่อลูกหนี้" {...field} className="h-12 sm:h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                                    <FormControl>
                                        <Input placeholder="08x-xxx-xxxx" {...field} className="h-12 sm:h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="loanAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ยอดเงินกู้ (บาท)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5000" {...field} className="h-12 sm:h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="managementFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ค่าดำเนินการ</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} className="h-12 sm:h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <FormLabel>ดอกเบี้ย ({watchedValues.interestType === 'DAILY' ? 'ต่อวัน' : 'ต่อเดือน'}) %</FormLabel>
                            <div className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="interestRate"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.5" {...field} className="h-12 sm:h-10" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="interestType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[120px] h-12 sm:h-10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DAILY">รายวัน</SelectItem>
                                                    <SelectItem value="MONTHLY">รายเดือน</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="totalInstallments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>จำนวนงวด ({watchedValues.interestType === 'DAILY' ? 'วัน' : 'เดือน'})</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="h-12 sm:h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {calculations.amount > 0 && (
                        <div className="bg-muted/50 p-4 rounded-xl border space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">สรุปการคำนวณ</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="text-muted-foreground">ดอกเบี้ย{watchedValues.interestType === 'DAILY' ? 'รายวัน' : 'รายเดือน'}:</div>
                                <div className="text-right font-medium">฿{calculations.dailyInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                                <div className="text-muted-foreground">รวมดอกเบี้ยทั้งหมด ({calculations.installments} {watchedValues.interestType === 'DAILY' ? 'วัน' : 'เดือน'}):</div>
                                <div className="text-right font-medium">฿{calculations.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                                <div className="border-t pt-2 text-muted-foreground font-semibold">ยอดรวมที่ต้องชำระ:</div>
                                <div className="border-t pt-2 text-right font-bold text-primary text-lg">฿{calculations.totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                                <div className="text-muted-foreground">ต้องส่งงวดละ:</div>
                                <div className="text-right font-bold text-green-600 text-base">฿{calculations.dailyInstallment.toLocaleString(undefined, { minimumFractionDigits: 2 })} / {watchedValues.interestType === 'DAILY' ? 'วัน' : 'เดือน'}</div>

                                {calculations.fee > 0 && (
                                    <>
                                        <div className="text-muted-foreground">หักค่าดำเนินการ:</div>
                                        <div className="text-right font-medium text-red-500">- ฿{calculations.fee.toLocaleString()}</div>
                                        <div className="text-muted-foreground font-semibold">ลูกหนี้ได้รับเงินสุทธิ:</div>
                                        <div className="text-right font-bold underline">฿{calculations.netReceived.toLocaleString()}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-background border-t p-4 sm:p-6 pb-8 sm:pb-6 mt-auto">
                    <Button
                        type="submit"
                        className="w-full bg-primary text-lg h-14 sm:h-12 shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                        disabled={!form.formState.isValid}
                    >
                        ยืนยันการกู้ยืม
                    </Button>
                </div>
            </form>
        </Form>
    )
}
