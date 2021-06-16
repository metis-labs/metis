import { AllDependencies } from '../store/types/networks';

export default class ImportConverter {
  private readonly builtInImportIDs: string[];

  private readonly thirdPartyImportIDs: string[];

  private readonly projectImportIDs: string[];

  private result: string;

  constructor() {
    this.builtInImportIDs = [];
    this.thirdPartyImportIDs = [];
    this.projectImportIDs = [];
    this.result = '';
  }

  orderDependencies(dependencies: AllDependencies): void {
    if (dependencies.builtInDeps) {
      for (const dependency of Object.values(dependencies.builtInDeps)) {
        this.builtInImportIDs.push(dependency.id);
      }
    }
    if (dependencies.thirdPartyDeps) {
      for (const dependency of Object.values(dependencies.thirdPartyDeps)) {
        this.thirdPartyImportIDs.push(dependency.id);
      }
    }
    if (dependencies.projectDeps) {
      for (const dependency of Object.values(dependencies.projectDeps)) {
        this.projectImportIDs.push(dependency.id);
      }
    }
    this.builtInImportIDs.sort();
    this.thirdPartyImportIDs.sort();
    this.projectImportIDs.sort();
  }

  update(dependencies: AllDependencies): void {
    this.orderDependencies(dependencies);
    if (this.builtInImportIDs.length > 0) {
      for (const builtInImportID of this.builtInImportIDs) {
        if (dependencies.builtInDeps[builtInImportID].package !== undefined) {
          this.result += `from ${dependencies.builtInDeps[builtInImportID].package} `;
        }
        this.result += `import ${dependencies.builtInDeps[builtInImportID].name}`;
        if (dependencies.builtInDeps[builtInImportID].alias !== undefined) {
          this.result += ` as ${dependencies.builtInDeps[builtInImportID].alias} `;
        }
        this.result += `\n`;
      }
      this.result += `\n`;
    }
    if (this.thirdPartyImportIDs.length > 0) {
      for (const thirdPartyImportID of this.thirdPartyImportIDs) {
        if (dependencies.thirdPartyDeps[thirdPartyImportID].package !== undefined) {
          this.result += `from ${dependencies.thirdPartyDeps[thirdPartyImportID].package} `;
        }
        this.result += `import ${dependencies.thirdPartyDeps[thirdPartyImportID].name}`;
        if (dependencies.thirdPartyDeps[thirdPartyImportID].alias !== undefined) {
          this.result += ` as ${dependencies.thirdPartyDeps[thirdPartyImportID].alias} `;
        }
        this.result += `\n`;
      }
      this.result += `\n`;
    }
    if (this.projectImportIDs.length > 0) {
      for (const projectImportID of this.projectImportIDs) {
        if (dependencies.projectDeps[projectImportID].package !== undefined) {
          this.result += `from ${dependencies.projectDeps[projectImportID].package} `;
        }
        this.result += `import ${dependencies.projectDeps[projectImportID].name}`;
        if (dependencies.projectDeps[projectImportID].alias !== undefined) {
          this.result += ` as ${dependencies.projectDeps[projectImportID].alias} `;
        }
        this.result += `\n`;
      }
      this.result += `\n`;
    }
  }

  getResult(): string {
    return this.result;
  }
}
