import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, useWindowDimensions, Platform, LayoutAnimation, UIManager } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, Surface, useTheme } from 'quartz-ui';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  FadeInLeft,
  FadeOutRight,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Layout,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CodePlaygroundProps {
  code: string;
  preview: React.ReactNode;
  title?: string;
  description?: string;
  language?: 'tsx' | 'jsx' | 'typescript' | 'javascript';
  fileName?: string;
}

// Token types for syntax highlighting
type TokenType =
  | 'keyword'
  | 'string'
  | 'template-string'
  | 'number'
  | 'comment'
  | 'operator'
  | 'punctuation'
  | 'tag'
  | 'tag-name'
  | 'attr-name'
  | 'attr-value'
  | 'component'
  | 'function'
  | 'variable'
  | 'type'
  | 'property'
  | 'plain';

interface Token {
  type: TokenType;
  content: string;
}

// Color palette inspired by VS Code Dark+ theme
const tokenColors: Record<TokenType, string> = {
  keyword: '#C586C0',        // Purple - import, export, const, etc.
  string: '#CE9178',         // Orange/brown - strings
  'template-string': '#CE9178',
  number: '#B5CEA8',         // Light green - numbers
  comment: '#6A9955',        // Green - comments
  operator: '#D4D4D4',       // Light gray - operators
  punctuation: '#D4D4D4',    // Light gray - brackets, semicolons
  tag: '#808080',            // Gray - < > / in JSX
  'tag-name': '#569CD6',     // Blue - HTML/JSX tag names
  'attr-name': '#9CDCFE',    // Light blue - attributes
  'attr-value': '#CE9178',   // Orange - attribute values
  component: '#4EC9B0',      // Teal - React components (PascalCase)
  function: '#DCDCAA',       // Yellow - function calls
  variable: '#9CDCFE',       // Light blue - variables
  type: '#4EC9B0',           // Teal - type annotations
  property: '#9CDCFE',       // Light blue - object properties
  plain: '#D4D4D4',          // Default text color
};

// Keywords for different languages
const keywords = new Set([
  'import', 'export', 'from', 'default', 'as',
  'const', 'let', 'var', 'function', 'return', 'yield',
  'if', 'else', 'switch', 'case', 'break', 'continue',
  'for', 'while', 'do', 'in', 'of',
  'try', 'catch', 'finally', 'throw',
  'async', 'await',
  'class', 'extends', 'implements', 'constructor',
  'interface', 'type', 'enum', 'namespace', 'module', 'declare',
  'public', 'private', 'protected', 'static', 'readonly', 'abstract',
  'new', 'this', 'super', 'typeof', 'instanceof', 'keyof',
  'void', 'null', 'undefined', 'true', 'false', 'NaN', 'Infinity',
  'get', 'set', 'delete',
]);

// Built-in types
const builtInTypes = new Set([
  'string', 'number', 'boolean', 'object', 'symbol', 'bigint',
  'any', 'unknown', 'never', 'void',
  'Array', 'Object', 'String', 'Number', 'Boolean', 'Function',
  'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
  'React', 'ReactNode', 'ReactElement', 'FC', 'Component',
]);

// Tokenizer for TypeScript/JavaScript/JSX/TSX
function tokenize(code: string): Token[][] {
  const lines = code.split('\n');
  const tokenizedLines: Token[][] = [];
  let inMultiLineComment = false;
  let inTemplateLiteral = false;

  for (const line of lines) {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // Handle multi-line comment continuation
      if (inMultiLineComment) {
        const endIndex = line.indexOf('*/', i);
        if (endIndex !== -1) {
          tokens.push({ type: 'comment', content: line.slice(i, endIndex + 2) });
          i = endIndex + 2;
          inMultiLineComment = false;
        } else {
          tokens.push({ type: 'comment', content: line.slice(i) });
          break;
        }
        continue;
      }

      // Handle template literal continuation
      if (inTemplateLiteral) {
        let content = '';
        while (i < line.length) {
          if (line[i] === '`') {
            content += '`';
            i++;
            inTemplateLiteral = false;
            break;
          } else if (line[i] === '\\' && i + 1 < line.length) {
            content += line.slice(i, i + 2);
            i += 2;
          } else {
            content += line[i];
            i++;
          }
        }
        tokens.push({ type: 'template-string', content });
        continue;
      }

      // Skip whitespace
      if (/\s/.test(line[i])) {
        let whitespace = '';
        while (i < line.length && /\s/.test(line[i])) {
          whitespace += line[i];
          i++;
        }
        tokens.push({ type: 'plain', content: whitespace });
        continue;
      }

      // Single-line comment
      if (line.slice(i, i + 2) === '//') {
        tokens.push({ type: 'comment', content: line.slice(i) });
        break;
      }

      // Multi-line comment start
      if (line.slice(i, i + 2) === '/*') {
        const endIndex = line.indexOf('*/', i + 2);
        if (endIndex !== -1) {
          tokens.push({ type: 'comment', content: line.slice(i, endIndex + 2) });
          i = endIndex + 2;
        } else {
          tokens.push({ type: 'comment', content: line.slice(i) });
          inMultiLineComment = true;
          break;
        }
        continue;
      }

      // JSX/HTML - opening tag
      if (line[i] === '<' && (line[i + 1] === '/' || /[A-Za-z]/.test(line[i + 1] || ''))) {
        const jsxTokens = parseJSXTag(line, i);
        if (jsxTokens.tokens.length > 0) {
          tokens.push(...jsxTokens.tokens);
          i = jsxTokens.endIndex;
          continue;
        }
      }

      // Template literal
      if (line[i] === '`') {
        let content = '`';
        i++;
        while (i < line.length) {
          if (line[i] === '`') {
            content += '`';
            i++;
            break;
          } else if (line[i] === '\\' && i + 1 < line.length) {
            content += line.slice(i, i + 2);
            i += 2;
          } else if (line.slice(i, i + 2) === '${') {
            // Template expression - simplified handling
            content += '${';
            i += 2;
            let braceCount = 1;
            while (i < line.length && braceCount > 0) {
              if (line[i] === '{') braceCount++;
              else if (line[i] === '}') braceCount--;
              content += line[i];
              i++;
            }
          } else {
            content += line[i];
            i++;
          }
        }
        if (!content.endsWith('`')) {
          inTemplateLiteral = true;
        }
        tokens.push({ type: 'template-string', content });
        continue;
      }

      // Regular string (single or double quotes)
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let content = quote;
        i++;
        while (i < line.length && line[i] !== quote) {
          if (line[i] === '\\' && i + 1 < line.length) {
            content += line.slice(i, i + 2);
            i += 2;
          } else {
            content += line[i];
            i++;
          }
        }
        if (i < line.length) {
          content += line[i];
          i++;
        }
        tokens.push({ type: 'string', content });
        continue;
      }

      // Numbers (including decimals and scientific notation)
      if (/[0-9]/.test(line[i]) || (line[i] === '.' && /[0-9]/.test(line[i + 1] || ''))) {
        let num = '';
        // Handle hex, binary, octal
        if (line[i] === '0' && /[xXbBoO]/.test(line[i + 1] || '')) {
          num = line.slice(i, i + 2);
          i += 2;
          while (i < line.length && /[0-9a-fA-F]/.test(line[i])) {
            num += line[i];
            i++;
          }
        } else {
          while (i < line.length && /[0-9.]/.test(line[i])) {
            num += line[i];
            i++;
          }
          // Scientific notation
          if (line[i] === 'e' || line[i] === 'E') {
            num += line[i];
            i++;
            if (line[i] === '+' || line[i] === '-') {
              num += line[i];
              i++;
            }
            while (i < line.length && /[0-9]/.test(line[i])) {
              num += line[i];
              i++;
            }
          }
        }
        tokens.push({ type: 'number', content: num });
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_$]/.test(line[i])) {
        let identifier = '';
        while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
          identifier += line[i];
          i++;
        }

        // Determine token type
        if (keywords.has(identifier)) {
          tokens.push({ type: 'keyword', content: identifier });
        } else if (builtInTypes.has(identifier)) {
          tokens.push({ type: 'type', content: identifier });
        } else if (/^[A-Z]/.test(identifier)) {
          // PascalCase - likely a component or type
          tokens.push({ type: 'component', content: identifier });
        } else {
          // Check if it's a function call
          let j = i;
          while (j < line.length && /\s/.test(line[j])) j++;
          if (line[j] === '(') {
            tokens.push({ type: 'function', content: identifier });
          } else if (line[j] === ':') {
            // Property in object or type annotation context
            tokens.push({ type: 'property', content: identifier });
          } else {
            tokens.push({ type: 'variable', content: identifier });
          }
        }
        continue;
      }

      // Operators (multi-char first)
      const operators = ['===', '!==', '==', '!=', '<=', '>=', '=>', '&&', '||', '??', '?.', '++', '--', '+=', '-=', '*=', '/=', '**', '...'];
      let foundOp = false;
      for (const op of operators) {
        if (line.slice(i, i + op.length) === op) {
          tokens.push({ type: 'operator', content: op });
          i += op.length;
          foundOp = true;
          break;
        }
      }
      if (foundOp) continue;

      // Single-char operators and punctuation
      if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
        tokens.push({ type: 'operator', content: line[i] });
        i++;
        continue;
      }

      // Punctuation
      if (/[{}()\[\];,.]/.test(line[i])) {
        tokens.push({ type: 'punctuation', content: line[i] });
        i++;
        continue;
      }

      // Default: unknown character
      tokens.push({ type: 'plain', content: line[i] });
      i++;
    }

    tokenizedLines.push(tokens);
  }

  return tokenizedLines;
}

// Parse JSX tag and return tokens
function parseJSXTag(line: string, startIndex: number): { tokens: Token[]; endIndex: number } {
  const tokens: Token[] = [];
  let i = startIndex;

  // Opening bracket
  tokens.push({ type: 'tag', content: '<' });
  i++;

  // Handle closing tag
  if (line[i] === '/') {
    tokens.push({ type: 'tag', content: '/' });
    i++;
  }

  // Tag name
  let tagName = '';
  while (i < line.length && /[a-zA-Z0-9._-]/.test(line[i])) {
    tagName += line[i];
    i++;
  }

  if (tagName) {
    // Check if it's a component (PascalCase) or HTML element
    if (/^[A-Z]/.test(tagName)) {
      tokens.push({ type: 'component', content: tagName });
    } else {
      tokens.push({ type: 'tag-name', content: tagName });
    }
  }

  // Parse attributes until we hit > or />
  while (i < line.length && line[i] !== '>') {
    // Whitespace
    if (/\s/.test(line[i])) {
      let ws = '';
      while (i < line.length && /\s/.test(line[i])) {
        ws += line[i];
        i++;
      }
      tokens.push({ type: 'plain', content: ws });
      continue;
    }

    // Self-closing
    if (line[i] === '/') {
      tokens.push({ type: 'tag', content: '/' });
      i++;
      continue;
    }

    // Spread operator {...props}
    if (line.slice(i, i + 4) === '{...') {
      tokens.push({ type: 'punctuation', content: '{...' });
      i += 4;
      let content = '';
      let braceCount = 1;
      while (i < line.length && braceCount > 0) {
        if (line[i] === '{') braceCount++;
        else if (line[i] === '}') {
          braceCount--;
          if (braceCount === 0) break;
        }
        content += line[i];
        i++;
      }
      if (content) {
        tokens.push({ type: 'variable', content });
      }
      if (line[i] === '}') {
        tokens.push({ type: 'punctuation', content: '}' });
        i++;
      }
      continue;
    }

    // JSX expression {value}
    if (line[i] === '{') {
      tokens.push({ type: 'punctuation', content: '{' });
      i++;
      let content = '';
      let braceCount = 1;
      while (i < line.length && braceCount > 0) {
        if (line[i] === '{') braceCount++;
        else if (line[i] === '}') {
          braceCount--;
          if (braceCount === 0) break;
        }
        content += line[i];
        i++;
      }
      // Tokenize the content inside braces
      if (content) {
        const innerTokens = tokenize(content)[0] || [];
        tokens.push(...innerTokens);
      }
      if (line[i] === '}') {
        tokens.push({ type: 'punctuation', content: '}' });
        i++;
      }
      continue;
    }

    // Attribute name
    let attrName = '';
    while (i < line.length && /[a-zA-Z0-9_-]/.test(line[i])) {
      attrName += line[i];
      i++;
    }

    if (attrName) {
      tokens.push({ type: 'attr-name', content: attrName });
    }

    // Skip whitespace after attribute name
    while (i < line.length && /\s/.test(line[i])) {
      tokens.push({ type: 'plain', content: line[i] });
      i++;
    }

    // Equals sign
    if (line[i] === '=') {
      tokens.push({ type: 'operator', content: '=' });
      i++;

      // Skip whitespace after equals
      while (i < line.length && /\s/.test(line[i])) {
        tokens.push({ type: 'plain', content: line[i] });
        i++;
      }

      // Attribute value
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let value = quote;
        i++;
        while (i < line.length && line[i] !== quote) {
          if (line[i] === '\\' && i + 1 < line.length) {
            value += line.slice(i, i + 2);
            i += 2;
          } else {
            value += line[i];
            i++;
          }
        }
        if (i < line.length) {
          value += line[i];
          i++;
        }
        tokens.push({ type: 'attr-value', content: value });
      } else if (line[i] === '{') {
        // JSX expression as value
        tokens.push({ type: 'punctuation', content: '{' });
        i++;
        let content = '';
        let braceCount = 1;
        while (i < line.length && braceCount > 0) {
          if (line[i] === '{') braceCount++;
          else if (line[i] === '}') {
            braceCount--;
            if (braceCount === 0) break;
          }
          content += line[i];
          i++;
        }
        if (content) {
          const innerTokens = tokenize(content)[0] || [];
          tokens.push(...innerTokens);
        }
        if (line[i] === '}') {
          tokens.push({ type: 'punctuation', content: '}' });
          i++;
        }
      }
    }
  }

  // Closing bracket
  if (line[i] === '>') {
    tokens.push({ type: 'tag', content: '>' });
    i++;
  }

  return { tokens, endIndex: i };
}

// Render tokens to React elements
function renderTokens(tokenLines: Token[][], theme: any): React.ReactNode[] {
  return tokenLines.map((tokens, lineIndex) => (
    <View key={lineIndex} style={styles.codeLine}>
      <Text style={[styles.lineNumber, { color: theme.colors.onSurfaceVariant + '50' }]}>
        {(lineIndex + 1).toString().padStart(3, ' ')}
      </Text>
      <Text style={styles.codeText}>
        {tokens.map((token, tokenIndex) => (
          <Text
            key={tokenIndex}
            style={[
              { color: tokenColors[token.type] },
              token.type === 'keyword' && styles.boldToken,
              token.type === 'component' && styles.boldToken,
              token.type === 'comment' && styles.italicToken,
            ]}
          >
            {token.content}
          </Text>
        ))}
      </Text>
    </View>
  ));
}

// Tab Button - Mobile optimized
function TabButton({
  icon,
  label,
  isActive,
  onPress,
  theme,
  isMobile,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: any;
  isMobile: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={[animatedStyle, { flex: 1 }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.tab,
          isActive && styles.tabActive,
          { minHeight: isMobile ? 56 : 48 },
        ]}
      >
        {isActive && (
          <LinearGradient
            colors={[theme.colors.primaryContainer + 'F0', theme.colors.secondaryContainer + 'E6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.tabContent}>
          <Ionicons
            name={icon}
            size={isMobile ? 24 : 22}
            color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          <Text
            variant="labelLarge"
            style={{
              color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant,
              fontWeight: isActive ? '800' : '600',
              marginLeft: 8,
              fontSize: isMobile ? 16 : 14,
            }}
          >
            {label}
          </Text>
        </View>
        {isActive && (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.activeIndicator}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

// Modern Copy Button with glassmorphism and smooth animations
function CopyButton({
  onPress,
  copied,
  isMobile,
}: {
  onPress: () => void;
  copied: boolean;
  isMobile: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 300 }) }],
  }));

  const handlePressIn = () => {
    scale.value = 0.95;
  };

  const handlePressOut = () => {
    scale.value = 1;
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.copyButton,
          {
            paddingHorizontal: isMobile ? 16 : 14,
            paddingVertical: isMobile ? 10 : 8,
          },
        ]}
      >
        <LinearGradient
          colors={copied 
            ? ['rgba(76, 175, 80, 0.9)', 'rgba(56, 142, 60, 0.9)'] 
            : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
        />
        <View style={styles.copyButtonContent}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={isMobile ? 18 : 16}
            color={copied ? '#fff' : '#a0a0a0'}
          />
          <Text
            style={[
              styles.copyButtonText,
              {
                color: copied ? '#fff' : '#a0a0a0',
                fontSize: isMobile ? 14 : 12,
              },
            ]}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function CodePlayground({
  code,
  preview,
  title = 'Example',
  description,
  language = 'tsx',
  fileName,
}: CodePlaygroundProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const isMobile = width < 768;

  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }, [code]);

  const displayFileName = useMemo(() => {
    return fileName || `${title.toLowerCase().replace(/\s+/g, '-')}.${language}`;
  }, [fileName, title, language]);

  const highlightedCode = useMemo(() => {
    const tokens = tokenize(code);
    return renderTokens(tokens, theme);
  }, [code, theme]);

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      style={[styles.container, { marginVertical: isMobile ? 20 : 24 }]}
    >
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: isMobile ? 12 : 8 },
            shadowOpacity: 0.15,
            shadowRadius: isMobile ? 32 : 24,
          },
        ]}
        elevation={isMobile ? 5 : 4}
      >
        {/* Header with title */}
        {(title || description) && (
          <View
            style={[
              styles.header,
              {
                borderLeftWidth: isMobile ? 5 : 4,
                borderLeftColor: theme.colors.primary,
                backgroundColor: theme.colors.surfaceContainerHighest + '40',
                padding: isMobile ? 24 : 20,
              },
            ]}
          >
            {title && (
              <Text
                variant="titleLarge"
                style={{
                  color: theme.colors.onSurface,
                  fontWeight: '900',
                  marginBottom: 4,
                  fontSize: isMobile ? 22 : 18,
                }}
              >
                {title}
              </Text>
            )}
            {description && (
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  lineHeight: isMobile ? 26 : 22,
                  opacity: 0.85,
                  fontSize: isMobile ? 16 : 14,
                }}
              >
                {description}
              </Text>
            )}
          </View>
        )}

        {/* Tabs - Mobile optimized with large touch targets */}
        <View
          style={[
            styles.tabs,
            { backgroundColor: theme.colors.surfaceContainerHighest + '60', padding: isMobile ? 12 : 8 },
          ]}
        >
          <View style={styles.tabsLeft}>
            <TabButton
              icon="eye"
              label="Preview"
              isActive={activeTab === 'preview'}
              onPress={() => setActiveTab('preview')}
              theme={theme}
              isMobile={isMobile}
            />
            <TabButton
              icon="code-slash"
              label="Code"
              isActive={activeTab === 'code'}
              onPress={() => setActiveTab('code')}
              theme={theme}
              isMobile={isMobile}
            />
          </View>
        </View>

        {/* Content area */}
        <View style={[styles.content, { backgroundColor: theme.colors.surfaceContainer, overflow: 'hidden' }]}>
          {activeTab === 'preview' ? (
            <Animated.View 
              key="preview"
              entering={FadeInLeft.duration(350).easing(Easing.out(Easing.cubic))} 
              exiting={FadeOutLeft.duration(250).easing(Easing.in(Easing.cubic))}
              style={[styles.preview, { padding: isMobile ? 32 : 40 }]}
            >
              {preview}
            </Animated.View>
          ) : (
            <Animated.View 
              key="code"
              entering={FadeInRight.duration(350).easing(Easing.out(Easing.cubic))} 
              exiting={FadeOutRight.duration(250).easing(Easing.in(Easing.cubic))}
              style={styles.codeContainer}
            >
              {/* Terminal-style header */}
              <View style={[styles.codeHeader, { backgroundColor: '#1a1a1a', paddingHorizontal: isMobile ? 16 : 20, paddingVertical: isMobile ? 14 : 12 }]}>
                <View style={styles.terminalDots}>
                  <View style={[styles.terminalDot, { backgroundColor: '#FF5F57', width: isMobile ? 14 : 12, height: isMobile ? 14 : 12 }]} />
                  <View style={[styles.terminalDot, { backgroundColor: '#FFBD2E', width: isMobile ? 14 : 12, height: isMobile ? 14 : 12 }]} />
                  <View style={[styles.terminalDot, { backgroundColor: '#28CA42', width: isMobile ? 14 : 12, height: isMobile ? 14 : 12 }]} />
                </View>

                <View style={styles.fileNameContainer}>
                  <Ionicons name="logo-react" size={isMobile ? 18 : 16} color="#61DAFB" />
                  <Text style={[styles.fileName, { fontSize: isMobile ? 15 : 13 }]}>{displayFileName}</Text>
                </View>

                <CopyButton
                  onPress={handleCopy}
                  copied={copied}
                  isMobile={isMobile}
                />
              </View>

              {/* Code Block - Horizontal scroll for mobile */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.codeScrollHorizontal}
                contentContainerStyle={styles.codeScrollHorizontalContent}
              >
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  style={styles.codeScrollVertical}
                  contentContainerStyle={styles.codeScrollVerticalContent}
                >
                  <View style={[styles.codeBlock, { backgroundColor: '#1e1e1e', padding: isMobile ? 20 : 24 }]}>
                    {highlightedCode}
                  </View>
                </ScrollView>
              </ScrollView>

              {/* Language Badge */}
              <LinearGradient
                colors={['#61DAFB', '#4FA3D1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.languageBadge,
                  {
                    top: isMobile ? 76 : 72,
                    right: isMobile ? 16 : 20,
                    paddingHorizontal: isMobile ? 14 : 12,
                    paddingVertical: isMobile ? 8 : 6,
                  },
                ]}
              >
                <Ionicons name="logo-react" size={isMobile ? 16 : 14} color="#FFFFFF" />
                <Text style={[styles.languageText, { fontSize: isMobile ? 13 : 11 }]}>{language.toUpperCase()}</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </View>

        {/* Info bar */}
        <View
          style={[
            styles.infoBar,
            {
              backgroundColor: theme.colors.surfaceContainerHighest + '40',
              paddingHorizontal: isMobile ? 20 : 20,
              paddingVertical: isMobile ? 14 : 12,
            },
          ]}
        >
          <View style={styles.infoLeft}>
            <Ionicons name="information-circle" size={isMobile ? 18 : 16} color={theme.colors.onSurfaceVariant} />
            <Text
              variant="labelSmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginLeft: 8,
                fontSize: isMobile ? 14 : 12,
              }}
            >
              {activeTab === 'preview'
                ? 'Interactive preview - Try it out!'
                : `${code.split('\n').length} lines of code`}
            </Text>
          </View>
          {activeTab === 'code' && (
            <View style={styles.infoRight}>
              <View style={[styles.statusDot, { backgroundColor: '#4CAF50', width: isMobile ? 10 : 8, height: isMobile ? 10 : 8 }]} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: isMobile ? 13 : 11 }}>
                Ready
              </Text>
            </View>
          )}
        </View>
      </Surface>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {},
  card: { borderRadius: 28, overflow: 'hidden' },
  header: {},
  tabs: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  tabsLeft: { flexDirection: 'row', gap: 8, flex: 1 },
  tab: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  tabContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  tabActive: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  activeIndicator: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 4, borderRadius: 2 },
  content: { overflow: 'hidden' },
  preview: { minHeight: 200, alignItems: 'center', justifyContent: 'center' },
  codeContainer: { position: 'relative' },
  codeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  terminalDots: { flexDirection: 'row', gap: 8 },
  terminalDot: { borderRadius: 10 },
  fileNameContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginLeft: 16 },
  fileName: { color: '#d4d4d4', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600' },
  copyButton: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  copyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyButtonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  codeScrollHorizontal: { maxHeight: 500 },
  codeScrollHorizontalContent: { flexGrow: 1 },
  codeScrollVertical: { flex: 1 },
  codeScrollVerticalContent: { flexGrow: 1 },
  codeBlock: { minWidth: '100%', flex: 1 },
  codeLine: { flexDirection: 'row', minHeight: 22 },
  lineNumber: { 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontSize: 13, 
    width: 48, 
    textAlign: 'right', 
    paddingRight: 16, 
    userSelect: 'none' as any,
  },
  codeText: { 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontSize: 13, 
    lineHeight: 22, 
    flex: 1,
  },
  boldToken: { fontWeight: '600' },
  italicToken: { fontStyle: 'italic' },
  languageBadge: { position: 'absolute', flexDirection: 'row', alignItems: 'center', borderRadius: 12, gap: 6, shadowColor: '#61DAFB', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  languageText: { color: '#FFFFFF', fontWeight: '900', letterSpacing: 0.5 },
  infoBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { borderRadius: 5 },
});
