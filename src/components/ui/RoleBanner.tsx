type Props = {
  role?: string | null;
};

export default function RoleBanner({ role }: Props) {

  const label =
    role === "super_admin"
      ? "Admin Portal"
      : role === "client"
      ? "Client Portal"
      : role === "supplier"
      ? "Supplier Portal"
      : null;

  if (!label) return null;

  return (
    <div className="w-full bg-[#0b1220] text-white py-2 px-6 text-sm font-semibold ">
        <div className="flex items-center justify-between">
            <div>SyNtis</div>
            <div>{label}</div>
        </div>
    </div>
  );
}
