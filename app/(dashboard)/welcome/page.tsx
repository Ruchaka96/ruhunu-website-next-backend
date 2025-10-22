import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Film,
    Building2,
    Clapperboard,
    BarChart3,
    ArrowRight,
    Ticket,
    Megaphone,
    Gift,
} from "lucide-react";
import { FileUser } from "@/components/icons";

export default function AdminWelcome() {
    return (
        <main className="px-6 py-8 md:px-10 lg:px-16">
            {/* Page Header */}
            <section className="flex flex-col gap-0 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome to Ruhunu Hospital Admin</h1>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                {/* Reservations */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {/* <Ticket className="h-4 w-4" /> */}
                            Docters <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card>

                {/* Sessions */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clapperboard className="h-4 w-4" />
                            Sessions <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Movies */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Film className="h-4 w-4" />
                            Movies <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Theaters */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Theaters <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Offers */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            Offers <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Advertise Requests */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Megaphone className="h-4 w-4" />
                            Advertise
                            <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Job Applications */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileUser className="h-4 w-4" />
                            Careers <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}

                {/* Reports */}
                {/* <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Reports <Badge className="ml-1" variant="secondary">Coming Soon</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">—</div>
                        <p className="text-xs text-muted-foreground mt-1">Module will unlock after initial setup.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="px-0" disabled>Preview</Button>
                    </CardFooter>
                </Card> */}
            </section>
        </main>
    );
}
