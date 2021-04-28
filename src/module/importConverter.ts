import { Dependency, EmptyNetwork } from '../store/types/networks';

export default class ImportConverter {
  private dependencies: { [id: string]: Dependency };

  private readonly externalImportList: string[];

  private readonly internalImportList: string[];

  private result: string;

  constructor() {
    this.dependencies = EmptyNetwork.dependencies;
    this.externalImportList = [];
    this.internalImportList = [];
    this.result = '';
  }

  orderedList(dependencies: { [id: string]: Dependency }): void {
    for (const [, importItem] of Object.entries(dependencies)) {
      if (importItem.package) {
        this.internalImportList.push(importItem.id);
      } else {
        this.externalImportList.push(importItem.id);
      }
    }
    this.internalImportList.sort();
    this.externalImportList.sort();
  }

  update(dependencies: { [id: string]: Dependency }): void {
    this.orderedList(dependencies);
    for (const importItem of this.externalImportList) {
      if (dependencies[importItem].package !== undefined) {
        this.result += `from ${dependencies[importItem].package} `;
      }
      this.result += `import ${dependencies[importItem].name}`;
      if (dependencies[importItem].alias !== undefined) {
        this.result += ` as ${dependencies[importItem].alias} `;
      }
      this.result += `\n`;
    }
    if (this.internalImportList) {
      this.result += `\n`;
    }
    for (const importItem of this.internalImportList) {
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
