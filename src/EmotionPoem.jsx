// EmotionPoem.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";

export default function EmotionPoem() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/poem", { text });
      const rawPoem = res.data.poem;

      // 제목과 본문 분리 (제목: 첫 줄, 본문: 나머지)
      const lines = rawPoem.split("\n").filter(line => line.trim() !== "");
      const title = lines[0]
        .replace(/^\[|\]$/g, "")
        .replace(/^【|】$/g, "")
        .trim();
      const body = lines.slice(1).join("\n");

      setResult({ emotions: res.data.emotions, title, body });
    } catch (err) {
      console.error("요청 실패:", err);
      setResult({ error: "시 생성 실패" });
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        감정 기반 시 생성기
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={5}
        label="당신의 감정을 표현해보세요"
        variant="outlined"
        value={text}
        onChange={e => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "생성 중..." : "시 생성하기"}
        </Button>
        {loading && <CircularProgress size={24} />}
      </Box>

      {result && result.error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {result.error}
        </Typography>
      )}

      {result && !result.error && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            감정 태그: {result.emotions}
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            「{result.title}」
          </Typography>
          <Typography component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            {result.body}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
