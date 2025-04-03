
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate('/dashboard');
  }, [navigate]);

  return null;
}

export default Index;
