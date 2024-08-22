import * as vscode from 'vscode';

export class oldStyleSearchProvider implements vscode.FileSearchProvider, vscode.TextSearchProvider {
	
	constructor(private _entries: vscode.Uri[]) {}
	private weakmap = new WeakMap<vscode.CancellationToken, vscode.Uri[]>();
	provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextSearchComplete> {
		const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5));
		const text = 'hello\nworld';
		progress.report({
			uri:  this._entries[0],
			ranges: range,
			preview: {
				text,
				matches: range
			}

		});
		progress.report({
			uri:  this._entries[0],
			ranges: new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 5)),
			preview: {
				text:'hello 2',
				matches: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5))
			}

		});
		return { limitHit: false, message: <vscode.TextSearchCompleteMessage>{text: 'Results are from Copilot',trusted:true,type: vscode.TextSearchCompleteMessageType.Information} };
	}
	// -- manage file search
	provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Uri[]> {
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