from pinecone import Pinecone

class PineconeStore:
    def __init__(self, api_key: str, index_name: str):
        self.api_key = api_key
        self.index_name = index_name
        self.pinecone = Pinecone(api_key=self.api_key)
        self.index = self.pinecone.Index(self.index_name)

    def upsert(self, vectors: list):
        self.index.upsert(vectors)

    def query(self, vector: list, top_k: int = 5):
        return self.index.query(vector, top_k=top_k)

    def delete(self, ids: list):
        self.index.delete(ids)

    def close(self):
        self.pinecone.close()