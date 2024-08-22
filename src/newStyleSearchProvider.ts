import * as vscode from 'vscode';

export class newStyleSearchProvider implements vscode.FileSearchProviderNew, vscode.TextSearchProviderNew {
	
	constructor(private _entries: vscode.Uri[]) {}
	private weakmap = new WeakMap<vscode.CancellationToken, vscode.Uri[]>();
	provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchProviderOptions, progress: vscode.Progress<vscode.TextSearchResultNew>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextSearchCompleteNew> {
		const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5));
		const text = 'hello\nworld';
		progress.report(
            new vscode.TextSearchMatchNew(this._entries[0], [{
                sourceRange: range,
                previewRange: range,
            }], text));


        progress.report(
            new vscode.TextSearchMatchNew(this._entries[0], [{
                sourceRange: new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 5)),
                previewRange: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5)),
            }], 'hello 2'));
                    
                
                
		return { limitHit: false, message: [<vscode.TextSearchCompleteMessageNew>{text: 'Results are from Copilot',trusted:true,type: vscode.TextSearchCompleteMessageType.Information}] };
	}
	// -- manage file search
	provideFileSearchResults(query: string, options: vscode.FileSearchProviderOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Uri[]> {
		console.log('here');
		console.log(options.session);
		return [...this._provideEntries(token)];
	}

	
	private _provideEntries(key: vscode.CancellationToken) {
		if (this.weakmap.has(key)) {
			console.log('has key');
		} else {
			this.weakmap.set(key, this._entries);
			console.log('no key');
		
		}
		return this._entries;
	}
}