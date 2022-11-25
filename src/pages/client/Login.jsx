import React, { useContext, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthProvider'
import { TextInput, PasswordInput, Text, Paper, Group, Button, Divider, Anchor, Stack, Switch, FileInput, Modal, Loader, LoadingOverlay } from '@mantine/core'
import { useToggle, upperFirst, useDocumentTitle } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import axios from 'axios'
import { IconBrandGoogle, IconBrandTwitter, IconUpload } from '@tabler/icons'
import { toast } from 'react-toastify'

const Login = () => {

  // Set page title
  useDocumentTitle('Login / Register - BackWatch');

  // Getting data from AuthContext
  const { user, googleProvider, twitterProvider, logInWithEmailPassword, logInWithPopup, signupWithEmailPassword, updateUserProfile, passwordResetEmail, loading, setLoading } = useContext(AuthContext);

  // useNavigate hook
  const navigate = useNavigate();

  // useLocation hook
  const location = useLocation();

  // Previous location
  const from = location.state?.from?.pathname || '/';

  // overlay loader state
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Modal state
  const [opened, setOpened] = useState(false);

  // Form switching state
  const [type, toggle] = useToggle(['login', 'register']);

  // Form initial values and validation
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      image: '',
      role: true, // Seller role
    },
    validate: {
      email: (val) => (!/^\S+@\S+$/.test(val)),
      password: (val) => (val.length <= 6),
      image: (val) => (!val && !form.values.image && type === 'register'),
    },
  });

  // Handle form submit
  const handleSubmit = values => {

    if (type === 'register') {
      const formData = new FormData();
      formData.append('image', values.image);
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
      axios.post(url, formData)
      .then(data => {
        if (data.data.success) {
          // Creating user with email and password function
          createUser(values.name, values.email, values.password, data.data.data.display_url, data.data.data.delete_url, values.role);
          // Disable the overlay loading
          setOverlayLoading(false);
        };
      }).catch((error) => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loading
        setOverlayLoading(false);
      });
    };

    // Creating user with email and password
    const createUser = (name, email, password, image, deleteImage, role) => {
      signupWithEmailPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        // Set use details
        updateUserProfile({ displayName: name, photoURL: image })
          .then(() => {
            // Profile updated!
          }).catch((error) => {
            // Error toast
            toast.error(error.code, {
              autoClose: 1500, position: toast.POSITION.TOP_CENTER
            });
          });
        // Storing user to the database function
        storeUser(user?.uid, name, email, image, deleteImage, role);
        // Successful toast
        toast.success('Account created successfully!', {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
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
        // Redirect to home
        navigate('/');
      }).catch((error) => {
        // Error toast
        toast.error(error.code, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      });
    };
    
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
        // Reditect to the targeted page
        navigate(from, { replace: true });
      }).catch((error) => {
        // Error toast
        toast.error(error.code, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
        // Disable the overlay loading
        setOverlayLoading(false);
      });
    };
  };

  // Handle social media authentication (Popup)
  const handleSocialAuth = provider => {
    // Creating user with social media (Popup)
    logInWithPopup(provider)
    .then(result => {
      // Signed in 
      const user = result.user;
      // Uplading the user photo to server
      const formData = new FormData();
      formData.append('image', user?.photoURL);
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMBB_API_KEY}`
      axios.post(url, formData)
      .then(data => {
        if (data.data.success) {
          // Creating user with email and password function
          storeUser(user?.uid, user?.displayName, user?.email, data.data.data.display_url, data.data.data.delete_url, false);
        };
      }).catch((error) => {
        // Error toast
        toast.error(error.message, {
          autoClose: 1500, position: toast.POSITION.TOP_CENTER
        });
      });
      // Successful toast
      toast.success('Logged in successfully!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Redirect to home page
      navigate('/');
    }).catch((error) => {
      // Error toast
      toast.error(`${error.code}`, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // Storing user to the database
  const storeUser = (uid, name, email, photoURL, photoDeleteURL, role) => {
    // Creating object
    const userInfo = {
      uid,
      name,
      email,
      photoURL,
      photoDeleteURL,
      role: role ? 'seller' : 'buyer'
    };
    console.log(userInfo);
  };

  // Handle password reset
  const passwordReset = (e, email) => {
    // Disabling form default behavior
    e.preventDefault();
  // Sending email
    passwordResetEmail(email)
    .then(() => {
      // Successful toast
      toast.success('Password reset email sent!', {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
      // Close the modal
      setOpened(false);
    }).catch((error) => {
      // Error toast
      toast.error(`${error.code}`, {
        autoClose: 1500, position: toast.POSITION.TOP_CENTER
      });
    });
  };

  // When user logged in redirect to home
  if (loading) {
    return <Loader variant="bars" className="flex mx-auto"/>
  };

  // When user logged in redirect to home
  if (user?.uid) {
    return <Navigate to="/" replace={true} />
  }

  return (
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

      <form onSubmit={form.onSubmit((values) => {handleSubmit(values); setOverlayLoading((v) => !v)})} style={{ width: 400, position: 'relative' }}>
        <LoadingOverlay visible={overlayLoading} overlayBlur={2} radius="sm" />
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
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
          />

          <Group style={{ display: 'block'}}>
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
          <Button type="submit" className="bg-primary hover:bg-secondary">{upperFirst(type)}</Button>
        </Group>
      </form>
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
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
            />
          </Stack>
          <Button type="submit" className="bg-primary hover:bg-secondary" position="apart" mt="md">Reset Password</Button>
        </form>
      </Modal>
    </Paper>
  )
};

export default Login;