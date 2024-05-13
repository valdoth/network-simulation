from flask import Flask, request, jsonify
import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
CORS(app, supports_credentials=True, methods=["GET", "POST", "OPTIONS"])

# Initialize the graph
G = nx.Graph()

# Your existing functions here (add_node, remove_node, add_edge, remove_edge, modify_node, dijkstra_networkx, display_graph)


# Fonction pour ajouter un nœud
def add_node(G, node_name, values):
    G.add_node(node_name, values=values)
    print(f"Node '{node_name}' added with values: {values}")


# Fonction pour supprimer un nœud
def remove_node(G, node_name):
    if G.has_node(node_name):
        G.remove_node(node_name)
        print(f"Node '{node_name}' removed.")
    else:
        print(f"Node '{node_name}' not found.")


# Fonction pour ajouter une arête
def add_edge(G, node1, node2, weight=0):
    G.add_edge(node1, node2, weight=int(weight))
    print(f"Edge between '{node1}' and '{node2}' added with weight: {weight}")


# Fonction pour supprimer une arête
def remove_edge(G, node1, node2):
    if G.has_edge(node1, node2):
        G.remove_edge(node1, node2)
        print(f"Edge between '{node1}' and '{node2}' removed.")
    else:
        print(f"Edge between '{node1}' and '{node2}' not found.")


# Fonction pour modifier les valeurs d'un nœud
def modify_node(G, node_name, new_values):
    if G.has_node(node_name):
        G.nodes[node_name]["values"] = new_values
        print(f"Node '{node_name}' modified with new values: {new_values}")
    else:
        print(f"Node '{node_name}' not found.")


def find_node_with_target_element(G, target_element):
    print(G.nodes)
    for node in G.nodes:
        if target_element in G.nodes[node]["values"]:
            return node
    return None


# Fonction pour afficher le graphe
def display_graph(G):
    plt.figure(figsize=(10, 8))
    nx.draw(G, with_labels=True)
    plt.savefig("graph_image.png")
    print("Graph displayed and saved as 'graph_image.png'")


# New function to calculate shortest path to a node with a specific value
def shortest_path_to_value(G, target_value, start_node):
    target_node = find_node_with_target_element(G, target_value)
    if target_node is None:
        return "No node found with the target value."

    try:
        path = nx.dijkstra_path(G, start_node, target_node, weight="weight")
        return path
    except nx.NetworkXNoPath:
        return "No path found."


# API endpoints for your existing functions
@app.route("/add_node", methods=["POST"])
def add_node_api():
    data = request.json
    node_name = data.get("node_name")
    values = data.get("values").split(",")
    add_node(G, node_name, values)
    return jsonify({"message": f"Node '{node_name}' added with values: {values}"})


@app.route("/remove_node", methods=["POST"])
def remove_node_api():
    data = request.json
    node_name = data.get("node_name")
    remove_node(G, node_name)
    return jsonify({"message": f"Node '{node_name}' removed."})


@app.route("/add_edge", methods=["POST"])
def add_edge_api():
    data = request.json
    node1 = data.get("node1")
    node2 = data.get("node2")
    weight = data.get("weight")
    add_edge(G, node1, node2, weight)
    return jsonify(
        {"message": f"Edge between '{node1}' and '{node2}' added with weight: {weight}"}
    )


@app.route("/remove_edge", methods=["POST"])
def remove_edge_api():
    data = request.json
    node1 = data.get("node1")
    node2 = data.get("node2")
    remove_edge(G, node1, node2)
    return jsonify({"message": f"Edge between '{node1}' and '{node2}' removed."})


@app.route("/modify_node", methods=["POST"])
def modify_node_api():
    data = request.json
    node_name = data.get("node_name")
    new_values = data.get("new_values").split(",")
    modify_node(G, node_name, new_values)
    return jsonify(
        {"message": f"Node '{node_name}' modified with new values: {new_values}"}
    )


@app.route("/display_graph", methods=["GET"])
def display_graph_api():
    display_graph(G)
    return jsonify({"message": "Graph displayed and saved as 'graph_image.png'"})


@app.route("/find_path", methods=["POST"])
def shortest_path_to_value_api():
    target_value = str(request.json.get("target_value"))
    server_name = str(request.json.get("server_name"))
    result = shortest_path_to_value(G, target_value, server_name)
    return jsonify({"result": result})


@app.route("/nodes", methods=["GET"])
def get_node():
    # Convert the graph to a dictionary
    graph_dict = nx.node_link_data(G)
    # Serialize the dictionary to JSON
    graph_json = jsonify(graph_dict)

    return graph_json


if __name__ == "__main__":
    app.run(debug=True)
