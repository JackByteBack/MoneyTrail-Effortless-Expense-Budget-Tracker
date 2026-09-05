"use client";

import { useState } from "react";
import { FloatingActionButton } from "@/components/transactions/FloatingActionButton";
import { QuickAddModal } from "@/components/transactions/QuickAddModal";

export function FABWithModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <FloatingActionButton onClick={() => setShowModal(true)} />
      {showModal && <QuickAddModal onClose={() => setShowModal(false)} />}
    </>
  );
}
