import { Dependency, EmptyNetwork } from '../store/types';

export default class ImportConverter {
  private dependencies: { [id: string]: Dependency };

  private readonly resultImportList: string[];

  private result: string;

  constructor() {
    this.dependencies = EmptyNetwork.dependencies;
    this.resultImportList = [];
    this.result = '';
  }

  orderedList(dependencies: { [id: string]: Dependency }): void {
    for (const [, importItem] of Object.entries(dependencies)) {
      this.resultImportList.push(importItem.id);
    }
  }

  update(dependencies: { [id: string]: Dependency }): void {
    this.orderedList(dependencies);
    for (const importItem of this.resultImportList) {
      if (dependencies[importItem].package !== undefined) {
        this.result += `from ${dependencies[importItem].package} `;
      }
      this.result += `import ${dependencies[importItem].name}`;
      if (dependencies[importItem].alias !== undefined) {
        this.result += ` as ${dependencies[importItem].alias} `;
      }
      this.result += `\n`;
    }
  }

  getResult(): string {
    return this.result;
  }
}
