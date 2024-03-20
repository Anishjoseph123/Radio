export const decodeMessage = {
  data: () => ({}),
  mounted() {},
  methods: {
    decodeMessageMethod(message) {
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(JSON.parse(message))));
    },
  },
};
