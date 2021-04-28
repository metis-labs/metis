import { Dependency } from '../store/types/networks';

export default class ImportConverter {
  private readonly externalImportIDs: string[];

  private readonly internalImportIDs: string[];

  private result: string;

  constructor() {
    this.externalImportIDs = [];
    this.internalImportIDs = [];
    this.result = '';
  }

  orderDependencies(dependencies: { [id: string]: Dependency }): void {
    for (const dependency of Object.values(dependencies)) {
      if (dependency.package) {
        this.internalImportIDs.push(dependency.id);
      } else {
        this.externalImportIDs.push(dependency.id);
      }
    }
    this.internalImportIDs.sort();
    this.externalImportIDs.sort();
  }

  update(dependencies: { [id: string]: Dependency }): void {
    this.orderDependencies(dependencies);
    for (const importItem of this.externalImportIDs) {
      if (dependencies[importItem].package !== undefined) {
        this.result += `from ${dependencies[importItem].package} `;
      }
      this.result += `import ${dependencies[importItem].name}`;
      if (dependencies[importItem].alias !== undefined) {
        this.result += ` as ${dependencies[importItem].alias} `;
      }
      this.result += `\n`;
    }
    if (this.internalImportIDs) {
      this.result += `\n`;
    }
    for (const importItem of this.internalImportIDs) {
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
