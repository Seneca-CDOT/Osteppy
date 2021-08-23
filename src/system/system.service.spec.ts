import SystemService from './system.service';

describe('System service', () => {
  const domain =
    'Nmap scan report for domain.cdot.systems (192.168.1.1)\n\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\nNmap done: 1 IP address (1 host up) scanned in 3.99 seconds\n';

  const parsedDomain = {
    domain: 'domain.cdot.systems',
    services: [{ port: 22 }, { port: 80 }, { port: 443 }],
  };

  const message =
    '```# Unregistered Opened Ports\n- Domain: domain.cdot.systems\n  Ports : 22 80 443\n```';

  test('Test domain parser', () => {
    const res = SystemService.parseDomain(domain);

    expect(res).toEqual(parsedDomain);
  });

  test('Test formatter', () => {
    const formattedMessage = SystemService.formatMessage([parsedDomain]);

    expect(formattedMessage).toBe(message);
  });
});
