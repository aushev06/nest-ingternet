/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/// Этот декоратор перехватывает все исключения и выводит в консоль

export function Catchable() {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    const fn = descriptor.value;
    console.log('Catchable set for class ', target.constructor.name, ' method ', propertyKey);
    descriptor.value = async function(...args): Promise<any> {
      console.log('called catchable decorator');
      try {
        const result = await fn.apply(this, args);
        return result;
      } catch (err) {
        console.log('Error catched in ', target.constructor.name, ' method ', propertyKey, err);
        throw err;
      }
    };
  };
}
