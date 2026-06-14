const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  reset: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
};

export const useNavigation = () => mockNavigation;
export const useRoute = () => ({ params: {} });
export const useFocusEffect = jest.fn();
export const NavigationContainer = ({ children }) => children;

export { mockNavigate, mockGoBack, mockNavigation };
