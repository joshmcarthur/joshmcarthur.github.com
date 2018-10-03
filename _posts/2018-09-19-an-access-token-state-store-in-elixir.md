---
layout: post
title: "An access token state store in Elixir"
description: "Using GenServer to create an access token store."
category: TIL
tags: [til,elixir]
---

I've recently been working on a small project that uses OAuth for authentication, which is proving
to be a great approach for what I need it for. After I got the OAuth authentication layer working
through, I realised that I needed a place to store the hash of user data I receive back from the
OAuth provider, along with some kind of access token I can use to authenticate requests to my
GraphQL API. This post describes the state store I created to manage access tokens.

Elixir has a built in module for background processes called GenServer. I actually managed to
implement most of what I needed simply based on the excellent documentation. The API for my module
wasn't very complicated - I just needed to insert access tokens, destroy access tokens (for logout
and invalidation), and check whether a given token exists. 

The module ended up quite simple:

``` elixir
defmodule ElixirAuthTokenStoreExample.Repo do
  use GenServer
  @name __MODULE__

  # Client

  @doc """
  Start the token repo server

  ## Example

    iex> {:ok, pid} = ElixirAuthTokenStoreExample.Repo.start_link(name: :repo_start_link_doctest)
    iex> is_pid(pid)
    true
  """
  def start_link(opts \\ []) do
    opts = Keyword.put_new(opts, :name, @name)
    store = []
    GenServer.start_link(__MODULE__, store, opts)
  end

  @doc """
  Insert a new token into the repo

  ## Example

    iex> {:ok, pid} = ElixirAuthTokenStoreExample.Repo.start_link(name: :repo_insert_doctest_1)
    iex> ElixirAuthTokenStoreExample.Repo.insert(pid, "abc123")
    iex> :sys.get_state(pid)
    ["abc123"]
  """
  def insert(pid \\ @name, token), do: GenServer.cast(pid, {:insert, token})

  @doc """
  Remove a token from the repo

  ## Example

    iex> {:ok, pid} = ElixirAuthTokenStoreExample.Repo.start_link(name: :repo_destroy_doctest_1)
    iex> ElixirAuthTokenStoreExample.Repo.insert(pid, "abc123")
    iex> ElixirAuthTokenStoreExample.Repo.destroy(pid, "abc123")
    iex> :sys.get_state(pid)
    []

  """
  def destroy(pid \\ @name, token), do: GenServer.cast(pid, {:destroy, token})

  @doc """
  Check whether a given token exists in the store

  ## Example

    iex> {:ok, pid} = ElixirAuthTokenStoreExample.Repo.start_link(name: :repo_exists_doctest_1)
    iex> ElixirAuthTokenStoreExample.Repo.insert(pid, "abc123")
    iex> ElixirAuthTokenStoreExample.Repo.exists?(pid, "abc123")
    true

    iex> {:ok, pid} = ElixirAuthTokenStoreExample.Repo.start_link(name: :repo_exists_doctest_2)
    iex> ElixirAuthTokenStoreExample.Repo.insert(pid, "abc123")
    iex> ElixirAuthTokenStoreExample.Repo.exists?(pid, "abc1234")
    false

  """
  def exists?(pid \\ @name, token), do: GenServer.call(pid, {:exists, token})

  # Server

  @impl true
  def init(tokens) do
    # This is the 'state' of the server
    {:ok, tokens}
  end

  @impl true
  def handle_cast({:insert, token}, state) do
    {:noreply, [token | state]}
  end

  def handle_cast({:destroy, token}, state) do
    {:noreply, state |> List.delete(token)}
  end

  @impl true
  def handle_call({:exists, token}, _from, state) do
    {:reply, state |> Enum.member?(token), state}
  end
end

```

This genserver can be added to your Mix application supervisor, which will ensure that a a process
will always be running holding the state that is available application-wide. Because of the simple
API we have defined, interacting with the token store is quite simple:

``` elixir
alias ElixirAuthTokenStoreExample.Repo

Repo.start_link()

# Insert a token
Repo.insert("abc123")

# Check it exists
Repo.exists?("abc123")

# Destroy a token
Repo.destroy("abc123")

```

I have placed this example code into a reference mix application, available at https://github.com/joshmcarthur/elixir-auth-token-store-example.

