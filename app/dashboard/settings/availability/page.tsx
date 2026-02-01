import { getAvailability } from "@/app/actions/availability";
import AvailabilityForm from "@/components/features/availability-form";

export default async function AvailabilitySettingsPage() {
    const data = await getAvailability();
    return <AvailabilityForm initialData={data} />;
}
