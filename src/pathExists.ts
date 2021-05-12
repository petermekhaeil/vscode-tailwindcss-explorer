import * as fs from 'fs';

const pathExists = (p: string): boolean => {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }

  return true;
};

export default pathExists;
