import SystemService from './system.service';

describe('System service', () => {
  const nmapOutput =
    'Nmap scan report for domain.cdot.systems (192.168.1.1)\n\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\nNmap done: 1 IP address (1 host up) scanned in 3.99 seconds\n';

  const nmapParsedDomain = {
    domain: 'domain.cdot.systems',
    services: [{ port: 22 }, { port: 80 }, { port: 443 }],
  };

  const databaseParsedDomain = {
    domain: 'domain.cdot.systems',
    services: [
      { port: 22, service: 'ssh' },
      { port: 80, service: 'http' },
      { port: 443, service: 'https' },
    ],
  };

  test('Test domain parser', () => {
    const res = SystemService.parseDomain(nmapOutput);

    expect(res).toEqual(nmapParsedDomain);
  });

  test('Test formatter for unregistered ports', () => {
    const unregisteredPortsMessage =
      '```# Unregistered Opened Ports\n- Domain: domain.cdot.systems\n  Ports : 22 80 443\n```';

    const formattedMessage = SystemService.formatMessage(
      [nmapParsedDomain],
      false,
    );

    expect(formattedMessage).toBe(unregisteredPortsMessage);
  });

  test('Test formatter for registered ports', () => {
    const registeredPortsMessage =
      '```# Registered Services\ndomain:\n22   ssh\n80   http\n443  https\n\n```';

    const formattedMessage = SystemService.formatMessage(
      [databaseParsedDomain],
      true,
    );

    expect(formattedMessage).toBe(registeredPortsMessage);
  });
});
