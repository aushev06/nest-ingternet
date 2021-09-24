const temp = process.exit;

process.exit = function(code?: number): never {
  console.trace('[ MEELZ-API ] EXIT ');
  process.exit = temp;
  process.exit(code);
};

const setup = (): void => {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
  });

  process.on('beforeExit', function() {
    // eslint-disable-next-line prefer-rest-params
    console.log('[ ERROR-EXIT ] Process beforeExit event with arguments: ', arguments);
  });

  process.on('exit', function() {
    // eslint-disable-next-line prefer-rest-params
    console.log('[ ERROR-EXIT ] Process exit event with arguments: ', arguments);
  });
};

setup();
