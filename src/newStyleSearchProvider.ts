import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';

export class newStyleSearchProvider implements vscode.FileSearchProviderNew, vscode.TextSearchProviderNew {
	

	findTextInFiles(str: string, progress: vscode.Progress<vscode.TextSearchResultNew>, surroundingContext: number) {
		const strLength = str.length;
		this.memfs.entries.forEach(entry=> {
			let contents;
			try {
				contents = this.memfs.readFile(entry);
			} catch(e) {
				return;
			}
			const lines = contents.toString().split('\n');
			const contextLines = new Map<number, string>();
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				const index = line.indexOf(str);
				if (index !== -1) {
					progress.report(new vscode.TextSearchMatchNew(entry, [
						{
							sourceRange: new vscode.Range(i, index, i, index + strLength),
							previewRange: new vscode.Range(0, index, 0, index + strLength),
						}
					], line));

					for (let j = 1; j <= surroundingContext; j++) {
						if (i + j < lines.length) {
							contextLines.set(i + j+1, lines[i + j]);
						}

						if (i - j >= 0) {
							contextLines.set(i - j+1, lines[i - j]);
						}
					}
				}
			}

			for (const [lineNumber, line] of contextLines) {
				progress.report(new vscode.TextSearchContextNew(entry, line, lineNumber));
			}
		});
	}
	constructor(private memfs: MemFS) {}
	private weakmap = new WeakMap<any, vscode.Uri[]>();
	provideTextSearchResults(query: vscode.TextSearchQueryNew, options: vscode.TextSearchProviderOptions, progress: vscode.Progress<vscode.TextSearchResultNew>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextSearchCompleteNew>{
		// const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5));
		// const text = 'hello\nworld';
		// progress.report(
        //     new vscode.TextSearchMatchNew(this.memfs.entries[0], [{
        //         sourceRange: range,
        //         previewRange: range,
        //     }], text));


        // progress.report(
        //     new vscode.TextSearchMatchNew(this.memfs.entries[0], [{
        //         sourceRange: new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 5)),
        //         previewRange: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5)),
        //     }], 'hello 2'));
                    
                
		this.findTextInFiles(query.pattern, progress, options.surroundingContext ?? 0);
                
		return { limitHit: false, message: [<vscode.TextSearchCompleteMessageNew>{text: 'Results are from Copilot',trusted:true,type: vscode.TextSearchCompleteMessageType.Information}] };
	}
	// -- manage file search
	provideFileSearchResults(query: string, options: vscode.FileSearchProviderOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Uri[]> {
		console.log('here');
		console.log(options.session);
		return [...this._provideEntries(options.session)];
	}

	
	private _provideEntries(key: unknown) {
		if (key === undefined) {
			return this.memfs.entries;
		}
		if (this.weakmap.has(key)) {
			console.log('has key');
		} else {
			this.weakmap.set(key, this.memfs.entries);
			console.log('no key');
		
		}
		return this.memfs.entries;
	}
}