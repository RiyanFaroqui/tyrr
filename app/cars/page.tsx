import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import CarsClient from "./CarsClient";
import getListings from "../actions/getListings";

const CarsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                title="Unauthorized"
                subtitle="Please login to view"
                />
            </ClientOnly>
        )
    }

    const listings = await getListings({userId: currentUser.id});

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                title="No cars found"
                subtitle="Looks like you don't have any cars listed"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <CarsClient
            listings={listings}
            currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default CarsPage;