import { getRoles } from "./_action";
import RoleForm from "./_form/role-form";

/**
 * Role page
 * @param props
 * @returns
 */
export default async function Page(props: PageProps<"/admin/role">) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams(searchParams as Record<string, string>);
  const roles = await getRoles(params);

  return (
    <div>
      <h1>Roles</h1>
      <RoleForm />
      {roles.map((role) => (
        <div key={role.id}>{role.name}</div>
      ))}
      {JSON.stringify(roles)}
    </div>
  );
}
