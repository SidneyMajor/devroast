import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardRoot, CardBadge, CardTitle, CardDescription } from "@/components/ui/card";
import { DiffLineRoot, DiffLinePrefix, DiffLineContent } from "@/components/ui/diff-line";
import { TableRowRoot, TableRowRank, TableRowScore, TableRowCode, TableRowLanguage } from "@/components/ui/table-row";
import { CodeBlock } from "@/components/ui/code-block";
import { ToggleDemo } from "@/components/ui/toggle-demo";
import { ScoreRing } from "@/components/ui/score-ring";

export default function ComponentsPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] p-8">
            <h1 className="font-mono text-3xl font-bold mb-8">
                <span className="text-[#10B981]">{"//"}</span> component_library
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="space-y-16">
                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> buttons
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">variant: primary</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button>roast_my_code</Button>
                                    <Button disabled>disabled</Button>
                                    <Button loading>loading</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">variant: secondary</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button variant="secondary">share_roast</Button>
                                    <Button variant="secondary" disabled>disabled</Button>
                                    <Button variant="secondary" loading>loading</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">variant: danger</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button variant="danger">delete_roast</Button>
                                    <Button variant="danger" disabled>disabled</Button>
                                    <Button variant="danger" loading>loading</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">variant: outline</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button variant="outline">outline</Button>
                                    <Button variant="outline" disabled>disabled</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">variant: ghost</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button variant="ghost">view_all &gt;&gt;</Button>
                                    <Button variant="ghost" disabled>disabled</Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-[#737373] font-mono">sizes</p>
                                <div className="flex gap-4 items-end">
                                    <Button size="sm">small</Button>
                                    <Button size="md">medium</Button>
                                    <Button size="lg">large</Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> toggle
                        </h2>
                        <ToggleDemo />
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-6 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> badge_status
                        </h2>

                        <div className="flex flex-wrap gap-6">
                            <Badge variant="critical">critical</Badge>
                            <Badge variant="warning">warning</Badge>
                            <Badge variant="good">good</Badge>
                            <Badge variant="verdict">needs_serious_help</Badge>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-6 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> score_ring
                        </h2>

                        <div className="flex gap-8">
                            <ScoreRing score={3.5} />
                            <ScoreRing score={9.8} />
                            <ScoreRing score={1.2} />
                        </div>
                    </section>
                </div>

                <div className="space-y-16">
                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> cards
                        </h2>

                        <div className="space-y-4 max-w-lg">
                            <CardRoot>
                                <CardBadge variant="critical">critical</CardBadge>
                                <CardTitle>using var instead of const/let</CardTitle>
                                <CardDescription>the var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs. modern javascript uses const for immutable bindings and let for mutable ones.</CardDescription>
                            </CardRoot>
                            <CardRoot>
                                <CardBadge variant="warning">warning</CardBadge>
                                <CardTitle>unused variable detected</CardTitle>
                                <CardDescription>the variable &apos;unused&apos; is declared but never used in this scope.</CardDescription>
                            </CardRoot>
                            <CardRoot>
                                <CardBadge variant="good">good</CardBadge>
                                <CardTitle>proper error handling</CardTitle>
                                <CardDescription>this function properly handles errors and provides meaningful error messages.</CardDescription>
                            </CardRoot>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> diff_line
                        </h2>

                        <div className="space-y-1 rounded-md border border-[#2A2A2A] overflow-hidden max-w-lg">
                            <DiffLineRoot type="removed">
                                <DiffLinePrefix type="removed" />
                                <DiffLineContent>var total = 0;</DiffLineContent>
                            </DiffLineRoot>
                            <DiffLineRoot type="added">
                                <DiffLinePrefix type="added" />
                                <DiffLineContent>const total = 0;</DiffLineContent>
                            </DiffLineRoot>
                            <DiffLineRoot type="context">
                                <DiffLinePrefix type="context" />
                                <DiffLineContent>for (let i = 0; i &lt; items.length; i++) {'{'}</DiffLineContent>
                            </DiffLineRoot>
                            <DiffLineRoot type="context">
                                <DiffLinePrefix type="context" />
                                <DiffLineContent>  total += items[i].price;</DiffLineContent>
                            </DiffLineRoot>
                            <DiffLineRoot type="context">
                                <DiffLinePrefix type="context" />
                                <DiffLineContent>{'}'}</DiffLineContent>
                            </DiffLineRoot>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> table_row
                        </h2>

                        <div className="rounded-md border border-[#2A2A2A] overflow-hidden max-w-lg">
                            <TableRowRoot>
                                <TableRowRank>#1</TableRowRank>
                                <TableRowScore>9.8</TableRowScore>
                                <TableRowCode>function calculateTotal(items) {'{'} return items.reduce((a, b) ={'>'} a + b.price, 0); {'}'}</TableRowCode>
                                <TableRowLanguage>javascript</TableRowLanguage>
                            </TableRowRoot>
                            <TableRowRoot>
                                <TableRowRank>#2</TableRowRank>
                                <TableRowScore>2.1</TableRowScore>
                                <TableRowCode>var total = 0; for (var i = 0; i &lt; items.length; i++) {'{'}</TableRowCode>
                                <TableRowLanguage>javascript</TableRowLanguage>
                            </TableRowRoot>
                            <TableRowRoot>
                                <TableRowRank>#3</TableRowRank>
                                <TableRowScore>1.5</TableRowScore>
                                <TableRowCode>const sum = (arr) ={'>'} arr.map(x ={'>'} x * 2);</TableRowCode>
                                <TableRowLanguage>javascript</TableRowLanguage>
                            </TableRowRoot>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="font-mono text-lg font-bold mb-4 text-[#A3A3A3]">
                            <span className="text-[#10B981]">{"//"}</span> code_block
                        </h2>

                        <div className="max-w-lg">
                            <CodeBlock
                                showHeader
                                filename="calculate.js"
                                language="javascript"
                                code={`function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
