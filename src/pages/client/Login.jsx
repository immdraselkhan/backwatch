import React, { useContext, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthProvider'
import { TextInput, PasswordInput, Text, Paper, Group, Button, Divider, Anchor, Stack, Switch, FileInput, Modal, LoadingOverlay, Box } from '@mantine/core'
import { useToggle, upperFirst, useDocumentTitle } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { IconBrandGoogle, IconBrandTwitter, IconUpload } from '@tabler/icons'
import axios from 'axios'
import { toast } from 'react-toastify'
import DataLoader from '../../components/common/DataLoader'

const Login = () => {

  // Set page title
  useDocumentTitle('Login / Register - BackWatch');

  // Get data from AuthContext
  const { user, googleProvider, twitterProvider, logInWithEmailPassword, logInWithPopup, signupWithEmailPassword, updateUserProfile, passwordResetEmail, loading } = useContext(AuthContext);

  // useNavigate hook
  const navigate = useNavigate();

  // useLocation hook
  const location = useLocation();

  // Previous location
  const from = location.state?.from?.pathname || '/';

  // Overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Modal state
  const [opened, setOpened] = useState(false);

  // Form switching state
  const [type, toggle] = useToggle(['login', 'register']);

  // Set JWT
  const setJWT = userId => {
    fetch(`${import.meta.env.VITE_API_Server}/jwt`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Store the token
        localStorage.setItem('token', data.token);
      } else {
        // Error toast
        toast.error(data.error, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Mantine useForm
  const form = useForm({
    // Form initial values
    initialValues: {
      name: '',
      email: '',
      password: '',
      image: '',
      role: true, // Seller role is default
    },
    // Form validation
    validate: {
      email: (value) => (!/\S+@\S+\.\S+/.test(value)),
      password: (value) => (value.length <= 6),
      image: (value) => (!value && !form.values.image && type === 'register'),
    },
  });

  // Handle form submit
  const handleSubmit = values => {

    // User registration form
    if (type === 'register') {
      const formData = new FormData();
      formData.append('image', values.image);
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
      axios.post(url, formData)
      .then(data => {
        if (data.data.success) {
          // Call create user fn with email and password
          createUser(values.name, values.email, values.password, data.data.data.display_url, data.data.data.delete_url, values.role);
        } else {
          // Error toast
          toast.error(data.data.message, {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Disable the overlay loader
          setOverlayLoading(false);
        };
      })
      .catch(error => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      });
    };

    // Create user with email and password
    const createUser = (name, email, password, image, deleteImage, role) => {
      signupWithEmailPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        // Update the user profile
        updateUserProfile({ displayName: name, photoURL: image })
          .then(() => {
            // Profile updated!
          })
          .catch(error => {
            // Error toast
            toast.error(error.code, {
              autoClose: 1500, position: toast.POSITION.TOP_CENTER
            });
          });
        // Call store user fn to database
        storeUser(user?.uid, name, email, image, deleteImage, role);
        // Send verification email [skipped for this assignment, after result just add enable the bellow code]
        // verifyEmail()
        // .then(() => {
        //   // Verification email sent toast
        //   toast.success('Verification email has been sent!', {
        //     autoClose: 1500, position: toast.POSITION.TOP_CENTER
        //   });
        // });
        // Form reset
        form.reset();
        // Successful toast
        toast.success('Account created successfully!', {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Call JWT fn
        setJWT(user?.uid);
        // Disable the overlay loader
        setOverlayLoading(false);
        // Redirect to targated page or home page
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      })
      .catch(error => {
        // Error toast
        toast.error(error.code, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      });
    };
    
    // User login form
    if (type === 'login') {
      // Sign in a user with email and password
      logInWithEmailPassword(values.email, values.password)
      .then(userCredential => {
        // Signed in 
        const user = userCredential.user;
        // Successful toast
        toast.success('Logged in successfully!', {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Form reset
        form.reset();
        // Call JWT fn
        setJWT(user?.uid);
        // Disable the overlay loader
        setOverlayLoading(false);
        // Redirect to targated page or home page
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      })
      .catch(error => {
        // Error toast
        toast.error(error.code, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loader
        setOverlayLoading(false);
      });
    };
  };

  // Handle social media authentication (Popup)
  const handleSocialAuth = provider => {
    // Create user with social media (Popup)
    logInWithPopup(provider)
    .then(result => {
      // Signed in 
      const user = result.user;
      // Verify user is new or old
      fetch(`${import.meta.env.VITE_API_Server}/user/${user?.uid}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Successful toast
          toast.success('Logged in successfully!', {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Call JWT fn
          setJWT(user?.uid);
          // Redirect to targated page or home page
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          // Upload user photo to server
          const formData = new FormData();
          formData.append('image', user?.photoURL);
          const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
          axios.post(url, formData)
          .then(data => {
            if (data.data.success) {
              // Call create user fn with email and password
              storeUser(user?.uid, user?.displayName, user?.email, data.data.data.display_url, data.data.data.delete_url, false);
            } else {
              // Error toast
              toast.error(data.data.message, {
                autoClose: 1500, position: toast.POSITION.TOP_CENTER
              });
            };
          })
          .catch(error => {
            // Error toast
            toast.error(error.message, {
              autoClose: 1500, position: toast.POSITION.TOP_CENTER
            });
          });
          // Successful toast
          toast.success('Account created successfully!', {
            autoClose: 1500, position: toast.POSITION.TOP_CENTER
          });
          // Call JWT fn
          setJWT(user?.uid);
          // Redirect to targated page or home page
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        };
      })
      .catch(error => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      });
    })
    .catch(error => {
      // Error toast
      toast.error(error.code, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Store user to database
  const storeUser = (uid, name, email, photoURL, photoDeleteURL, role) => {
    // Create object to send to the database
    const userInfo = {
      uid,
      name,
      email,
      photoURL,
      photoDeleteURL,
      role: role ? 'seller' : 'buyer'
    };

    // Store object to database
    axios.post(`${import.meta.env.VITE_API_Server}/add-user`, userInfo)
    .then(data => {
      if (data.data.success) {
        // Succssfull toast
        // toast.success(data.data.message, {
        //   autoClose: 1500, position: toast.POSITION.TOP_CENTER
        // });
      } else {
        // Error toast
        toast.error(data.data.error, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      };
    })
    .catch(error => {
      // Error toast
      toast.error(error.message, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Handle password reset
  const passwordReset = (e, email) => {
    // Disable form default behavior
    e.preventDefault();
    // Send reset email
    passwordResetEmail(email)
    .then(() => {
      // Successful toast
      toast.success('Password reset email sent!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Close the modal
      setOpened(false);
    })
    .catch(error => {
      // Error toast
      toast.error(error.code, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Loader until we got the data
  if (loading) {
    return <DataLoader />;
  };

  // When user logged in return to the previous page or home page
  if (user?.uid) {
    return <Navigate to='/' state={{ from: location }} replace />;
  };

  return (
    <section className="mx-4">
      <Paper radius="md" p="xl" className="max-w-md mx-auto" withBorder>
        <Text size="lg" weight={500} align="center" mb={20}>
          Welcome to BackWatch, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <Button
            size="md"
            component="a"
            leftIcon={<IconBrandGoogle size={20} color="#00ACEE" />}
            variant="default"
            onClick={() => handleSocialAuth(googleProvider)}
          >
            Google
          </Button>
          <Button
            size="md"
            component="a"
            leftIcon={<IconBrandTwitter size={20} color="#00ACEE" />}
            variant="default"
            onClick={() => handleSocialAuth(twitterProvider)}
          >
            Twitter
          </Button>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <Box style={{ maxWidth: 400, position: 'relative' }} mx="auto">
          <form onSubmit={form.onSubmit((values) => { handleSubmit(values); setOverlayLoading((v) => !v) })}>
            <LoadingOverlay visible={overlayLoading} overlayBlur={1} radius="sm" />
            <Stack>
              {type === 'register' && (
                <TextInput
                  required
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hi@backwatchshop.web.app"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
              />

              <Group style={{ display: 'block' }}>
                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  value={form.values.password}
                  onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                  error={form.errors.password && 'Password should include at least 6 characters'}
                />
                {type === 'login' && (
                  <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={() => setOpened(true)}
                    size="xs"
                  >Forgot password?
                  </Anchor>
                )}
              </Group>

              {type === 'register' && (
                <>
                  <FileInput
                    required
                    accept={"image/png,image/jpeg"}
                    label="Your photo"
                    placeholder="Your photo"
                    icon={<IconUpload size={14} />}
                    value={form.values.image}
                    onChange={(event) => form.setFieldValue('image', event)}
                    error={form.errors.image && 'Photo upload is required'}
                  />
                  <Switch
                    defaultChecked={form.values.role}
                    label="I want to be a seller!"
                    onChange={(event) => form.setFieldValue('role', event.currentTarget.checked)}
                  />
                </>
              )}
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type="submit">{upperFirst(type)}</Button>
            </Group>
          </form>
        </Box>
        <Modal
          centered
          opened={opened}
          onClose={() => setOpened(false)}
          title="Reset Account Password"
        >
          <form onSubmit={(e) => passwordReset(e, form.values.email)}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="hi@backwatchshop.web.app"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
              />
            </Stack>
            <Button type="submit" position="apart" mt="md">Reset Password</Button>
          </form>
        </Modal>
      </Paper>  
    </section>
  )
};

export default Login;