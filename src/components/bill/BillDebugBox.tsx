import { useState } from 'react';
import pako from 'pako';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface BillDebugBoxProps {
	bill: unknown;
}

const BillDebugBox = ({ bill }: BillDebugBoxProps) => {
	const [open, setOpen] = useState(false);
	const billJson = JSON.stringify(bill, null, 2);
	let gzippedBase64 = '';
	const uncompressedLength = billJson.length;
	try {
		const gzipped = pako.gzip(billJson);
		gzippedBase64 = btoa(String.fromCharCode(...gzipped));
	} catch {
		gzippedBase64 = 'GZIP error';
	}
	const compressedCharLength = gzippedBase64.length;

	return (
		<div className="fixed bottom-0 left-0 z-50 w-full">
			<div className="mx-auto max-w-2xl">
				<Collapsible open={open} onOpenChange={setOpen}>
					<CollapsibleTrigger asChild>
						<Button variant="secondary" className="w-full rounded-b-none text-xs font-semibold">
							<span>Bill Debug Info</span>
							<span>{open ? '▼' : '▲'}</span>
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<Card className="rounded-t-none">
							<CardHeader>
								<CardTitle>Bill Debug Info</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 md:flex-row">
								<div className="min-w-0 flex-1">
									<div className="mb-1 font-bold">Bill JSON</div>
									<pre className="max-h-40 overflow-x-auto rounded border bg-white p-2 text-xs">
										{billJson}
									</pre>
								</div>
								<div className="min-w-0 flex-1">
									<div className="mb-1 font-bold">GZIPPED (base64)</div>
									<pre className="max-h-40 overflow-x-auto rounded border bg-white p-2 text-xs">
										{gzippedBase64}
									</pre>
								</div>
								<div className="w-48 min-w-0">
									<div className="mb-1 font-bold">Lengths</div>
									<div className="rounded border bg-white p-2 text-xs">
										<div>Uncompressed: {uncompressedLength} chars</div>
										<div>Compressed: {compressedCharLength} chars</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</CollapsibleContent>
				</Collapsible>
			</div>
		</div>
	);
};

export default BillDebugBox;
