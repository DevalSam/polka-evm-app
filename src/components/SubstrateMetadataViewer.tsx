import { useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

export function SubstrateMetadataViewer() {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsEndpoint, setWsEndpoint] = useState('wss://rpc.polkadot.io');

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const provider = new WsProvider(wsEndpoint);
        const api = await ApiPromise.create({ provider });
        const meta = api.runtimeMetadata.toHuman();
        setMetadata(meta);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch metadata. Check your endpoint.');
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [wsEndpoint]);

  return (
    <div className="substrate-metadata-viewer">
      <h3>Substrate Metadata Viewer</h3>
      <input
        type="text"
        value={wsEndpoint}
        onChange={(e) => setWsEndpoint(e.target.value)}
        placeholder="wss://your-substrate-node"
        className="input"
      />
      {loading && <p>Loading metadata...</p>}
      {error && <p className="error">{error}</p>}
      {metadata && (
        <pre style={{ maxHeight: 400, overflowY: 'scroll', background: '#f5f5f5', padding: 10 }}>
          {JSON.stringify(metadata, null, 2)}
        </pre>
      )}
    </div>
  );
}
