import { checkIsAdmin } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import { AdminPanelClient } from "@/components/admin/admin-panel-client";

export default async function AdminPanelPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) redirect("/");

  return <AdminPanelClient />;
}
