"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Pricing() {
    return (
        <section className="py-20 bg-paper">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-marker mb-4">Membership</h2>
                    <p className="text-ink/60">Support the quiet web.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <Card className="border-ink/10 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-2xl">Free</CardTitle>
                            <div className="text-3xl font-bold mt-2">$0<span className="text-base font-normal text-ink/50">/mo</span></div>
                            <p className="text-sm text-ink/60 mt-2">For casual local usage.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Post up to 3 notices per month</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>See notices in your radius</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Read public replies</span>
                                </li>
                                <li className="flex items-center gap-2 opacity-50">
                                    <X className="w-4 h-4" />
                                    <span>Private replies</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-muted-blue/30 bg-muted-blue/5 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl text-muted-blue">Pro</CardTitle>
                            <div className="text-3xl font-bold mt-2">$5<span className="text-base font-normal text-ink/50">/mo</span></div>
                            <p className="text-sm text-ink/60 mt-2">For power users & supporters.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-muted-blue" />
                                    <span><strong>Unlimited</strong> notices</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-muted-blue" />
                                    <span>Expand radius + Advanced filters</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-muted-blue" />
                                    <span>Send & receive <strong>private replies</strong></span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-muted-blue" />
                                    <span>"Urgent" flag for notices</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-muted-blue hover:bg-muted-blue/90 text-white">Upgrade to Pro</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
