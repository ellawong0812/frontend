import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [newMood, setNewMood] = useState("");
  const [newRecipe, setNewRecipe] = useState("");
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [updatedRecipeContent, setUpdatedRecipeContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5010/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data.reverse()); // Reverse to show latest added first
      setFilteredRecipes(response.data.reverse());
    };

    const decodeToken = () => {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
    };

    fetchRecipes();
    decodeToken();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilteredRecipes(
      recipes.filter(
        (recipe) =>
          recipe.mood.toLowerCase().includes(term.toLowerCase()) ||
          recipe.recipe.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const generateRecipes = () => {
    const filtered = recipes.filter((recipe) => recipe.mood === selectedMood);
    setGeneratedRecipes(filtered);
  };

  const addRecipe = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5010/recipes",
      { mood: newMood, recipe: newRecipe },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecipes([{ mood: newMood, recipe: newRecipe }, ...recipes]);
    setFilteredRecipes([{ mood: newMood, recipe: newRecipe }, ...recipes]);
    setNewMood("");
    setNewRecipe("");
  };

  //   const updateRecipe = async (id, updatedRecipe) => {
  //     const token = localStorage.getItem("token");
  //     await axios.put(
  //       `http://localhost:5010/recipes/${id}`,
  //       { recipe: updatedRecipe },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setRecipes((prev) =>
  //       prev.map((item) =>
  //         item.id === id ? { ...item, recipe: updatedRecipe } : item
  //       )
  //     );
  //     setFilteredRecipes((prev) =>
  //       prev.map((item) =>
  //         item.id === id ? { ...item, recipe: updatedRecipe } : item
  //       )
  //     );
  //   };

  const startEditing = (id, currentContent) => {
    setEditingRecipeId(id); // Set the ID of the recipe being edited
    setUpdatedRecipeContent(currentContent); // Set the current recipe content
  };

  //   const saveUpdatedRecipe = async (id) => {
  //     const token = localStorage.getItem("token");
  //     try {
  //       await axios.put(
  //         `http://localhost:5010/recipes/${id}`,
  //         { recipe: updatedRecipeContent },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       setRecipes((prev) =>
  //         prev.map((item) =>
  //           item.id === id ? { ...item, recipe: updatedRecipeContent } : item
  //         )
  //       );
  //       setFilteredRecipes((prev) =>
  //         prev.map((item) =>
  //           item.id === id ? { ...item, recipe: updatedRecipeContent } : item
  //         )
  //       );
  //       setEditingRecipeId(null); // Exit editing mode
  //     } catch (error) {
  //       console.error("Error updating recipe:", error);
  //     }
  //   };

  const saveUpdatedRecipe = async (id) => {
    console.log("id", id);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5010/recipes/${id}`, // Ensure the ID is correct here
        { recipe: updatedRecipeContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Recipe updated successfully!");
      setEditingRecipeId(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const cancelEditing = () => {
    setEditingRecipeId(null); // Exit editing mode
  };

  ///////
  const updateRecipe = async (id, updatedRecipe) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5010/recipes/${id}`,
        { recipe: updatedRecipe },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const downloadPDF = (recipe) => {
    const doc = new jsPDF();
    doc.text(`Recipe: ${recipe}`, 10, 10);
    doc.save("recipe.pdf");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="header">
        <h2>Home</h2>
        <button onClick={logout} style={{ marginBottom: "20px" }}>
          Log Out
        </button>
      </div>
      {role === "user" && (
        <div className="container">
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
          >
            <option value="">Select Mood</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.mood}>
                {recipe.mood}
              </option>
            ))}
          </select>
          <button className="generate-btn" onClick={generateRecipes}>
            Generate
          </button>
          <button className="pdf-btn" onClick={() => downloadPDF(selectedMood)}>
            Download PDF
          </button>
          <h3>Generated Recipes</h3>
          <table border="1" className="recipe-table">
            <thead>
              <tr>
                <th>Mood</th>
                <th>Recipe</th>
              </tr>
            </thead>
            <tbody>
              {generatedRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.mood}</td>
                  <td>{recipe.recipe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {role === "admin" && (
        <div className="container">
          <h3>Add Recipe</h3>
          <input
            type="text"
            placeholder="Mood"
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            className="recipe-input"
          />
          <input
            type="text"
            placeholder="Recipe"
            value={newRecipe}
            onChange={(e) => setNewRecipe(e.target.value)}
            className="recipe-input"
          />
          <button onClick={addRecipe}>Add</button>
          <h3>All Recipes</h3>
          <input
            type="text"
            placeholder="Search by mood or recipe"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "10px", display: "block" }}
            className="recipe-input"
          />
          <table border="1" className="recipe-table">
            <thead>
              <tr>
                <th>Mood</th>
                <th>Recipe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.mood}</td>
                  <td>
                    {editingRecipeId === recipe.id ? (
                      <input
                        type="text"
                        value={updatedRecipeContent}
                        onChange={(e) =>
                          setUpdatedRecipeContent(e.target.value)
                        }
                      />
                    ) : (
                      recipe.recipe
                    )}
                  </td>
                  <td>
                    {editingRecipeId === recipe.id ? (
                      <>
                        <button
                          className="btn save-btn"
                          onClick={() => saveUpdatedRecipe(recipe.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn cancel-btn"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn edit-btn"
                        onClick={() => startEditing(recipe.id, recipe.recipe)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
