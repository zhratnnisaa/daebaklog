import { BoyGroupForm } from "@/components/admin/boygroup-form";

export default function NewBoyGroupPage() {
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-4">Tambah BoyGroup</h1>
      <BoyGroupForm />
    </div>
  );
}