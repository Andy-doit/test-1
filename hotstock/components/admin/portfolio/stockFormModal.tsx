// hotstock/components/admin/portfolio/StockFormModal.tsx

"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { calcReturnRate, calcStopLoss } from "@/lib/portfolio-calc"
import type { Stock } from "@/types/portfolio"

interface StockFormModalProps {
  stock: Stock | null
  isOpen: boolean
  onClose: () => void
  onSave: (stock: Stock) => void
}

export const StockFormModal: React.FC<StockFormModalProps> = ({ stock, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Stock>(
    stock || {
      id: "",
      ticker: "",
      sector: "",
      buyDate: "",
      costPrice: 0,
      marketPrice: 0,
      weight: 0,
      targetPrice: 0,
      beta: 0,
      mdd: 0,
    }
  )

  const preview = {
    returnRate: calcReturnRate(formData.costPrice, formData.marketPrice),
    stopLoss: calcStopLoss(formData.costPrice),
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "weight" || name === "costPrice" || name === "marketPrice" || name === "targetPrice" || name === "beta" || name === "mdd" ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = () => {
    if (formData.weight <= 0 || formData.weight > 1) {
      alert("Tỷ trọng phải nằm trong khoảng (0, 1]")
      return
    }
    onSave(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stock ? "Sửa cổ phiếu" : "Thêm cổ phiếu mới"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="ticker" value={formData.ticker} onChange={handleChange} placeholder="Mã cổ phiếu" />
          <Input name="sector" value={formData.sector} onChange={handleChange} placeholder="Ngành" />
          <Input name="buyDate" value={formData.buyDate} onChange={handleChange} placeholder="Ngày mua" type="date" />
          <Input name="weight" value={formData.weight} onChange={handleChange} placeholder="Tỷ trọng" type="number" step="0.01" />
          <Input name="costPrice" value={formData.costPrice} onChange={handleChange} placeholder="Giá vốn" type="number" step="0.1" />
          <Input name="marketPrice" value={formData.marketPrice} onChange={handleChange} placeholder="Giá thị trường" type="number" step="0.1" />
          <Input name="targetPrice" value={formData.targetPrice} onChange={handleChange} placeholder="Giá mục tiêu" type="number" step="0.1" />
          <Input name="beta" value={formData.beta} onChange={handleChange} placeholder="Beta" type="number" step="0.01" />
          <Input name="mdd" value={formData.mdd} onChange={handleChange} placeholder="MDD" type="number" step="0.0001" />
          <div className="bg-secondary p-4 rounded">
            <p>Tỷ suất lãi/lỗ: {preview.returnRate.toFixed(2)}%</p>
            <p>Giá dừng lỗ: {preview.stopLoss.toFixed(2)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
