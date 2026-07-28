CREATE TABLE node_adjacency (
  node_id      INTEGER NOT NULL,
  prev_node_id INTEGER,
  next_node_id INTEGER,

  CONSTRAINT node_adjacency_pkey PRIMARY KEY (node_id),
  CONSTRAINT fk_node_adjacency_node FOREIGN KEY (node_id) REFERENCES feature_nodes(id) ON DELETE CASCADE,
  CONSTRAINT fk_node_adjacency_prev FOREIGN KEY (prev_node_id) REFERENCES feature_nodes(id) ON DELETE SET NULL,
  CONSTRAINT fk_node_adjacency_next FOREIGN KEY (next_node_id) REFERENCES feature_nodes(id) ON DELETE SET NULL
);

CREATE INDEX node_adjacency_prev_node_id_idx ON node_adjacency(prev_node_id);
CREATE INDEX node_adjacency_next_node_id_idx ON node_adjacency(next_node_id);
