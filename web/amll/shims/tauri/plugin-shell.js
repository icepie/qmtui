export const open = async (target) => { window.open(target, '_blank', 'noopener'); };
export class Command {
  constructor() {}
  on() { return this; }
  async execute() { return { code: 0, stdout: '', stderr: '' }; }
  async spawn() { return { kill: async () => {}, write: async () => {} }; }
}
