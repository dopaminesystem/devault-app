import { CreateSpaceForm } from "@/components/space/create-space-form";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>Welcome to your space manager.</p>
            </div>

            <CreateSpaceForm />
        </div>
    );
}
