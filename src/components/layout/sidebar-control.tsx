import Avatar from "../ui/avatar";

export default function SidebarControl() {
  return (
    <div className="flex gap-2 items-center justify-center flex-col">
      <Avatar size={120} />
      <h6 className="font-semibold text-sm">
        Pradeep Kumar
        <small className="block font-normal text-slate-700">
          (Software engineer)
        </small>
      </h6>
    </div>
  );
}
